// import {
//   ComponentOptionsBase,
//   ComponentOptionsMixin,
//   ComponentPropsOptions,
//   ComputedOptions,
//   CreateComponentPublicInstance,
//   EmitsOptions,
//   ExtractDefaultPropTypes,
//   ExtractPropTypes,
//   MethodOptions,
// } from 'vue';

// type DefineComponent<
//   PropsOrPropOptions = {},
//   RawBindings = {},
//   D = {},
//   C extends ComputedOptions = ComputedOptions,
//   M extends MethodOptions = MethodOptions,
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   PP = PublicProps,
//   Props = Readonly<
//     PropsOrPropOptions extends ComponentPropsOptions ? ExtractPropTypes<PropsOrPropOptions> : PropsOrPropOptions
//   > &
//     ({} extends E ? {} : EmitsToProps<E>),
//   Defaults = ExtractDefaultPropTypes<PropsOrPropOptions>,
// > = ComponentPublicInstanceConstructor<
//   CreateComponentPublicInstance<Props, RawBindings, D, C, M, Mixin, Extends, E, PP & Props, Defaults, true> & Props
// > &
//   ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, E, EE, Defaults> &
//   PP;
