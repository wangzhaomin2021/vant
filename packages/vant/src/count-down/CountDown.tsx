// @wzm preview 2022-12-16
import { watch, computed, defineComponent, type ExtractPropTypes } from 'vue';

// Utils
import {
  truthProp,
  makeStringProp,
  makeNumericProp,
  createNamespace,
} from '../utils';
import { parseFormat } from './utils';

// Composables
import { useCountDown } from '@vant/use';
import { useExpose } from '../composables/use-expose';

const [name, bem] = createNamespace('count-down');

export const countDownProps = {
  time: makeNumericProp(0),
  format: makeStringProp('HH:mm:ss'),
  autoStart: truthProp,
  millisecond: Boolean,
};

export type CountDownProps = ExtractPropTypes<typeof countDownProps>;

export default defineComponent({
  name,

  props: countDownProps,

  emits: ['change', 'finish'],

  setup(props, { emit, slots }) {
    const { start, pause, reset, current } = useCountDown({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: (current) => emit('change', current),
      onFinish: () => emit('finish'),
    });

    // 倒计时显示文本
    const timeText = computed(() => parseFormat(props.format, current.value));

    // 重置时间
    const resetTime = () => {
      reset(+props.time);

      if (props.autoStart) { // 自动倒计时
        start();
      }
    };

    watch(() => props.time, resetTime, { immediate: true });

    // 对外暴露
    useExpose({
      start,
      pause,
      reset: resetTime,
    });

    // template
    return () => (
      <div role="timer" class={bem()}>
        {slots.default ? slots.default(current.value) : timeText.value}
      </div>
    );
  },
});
