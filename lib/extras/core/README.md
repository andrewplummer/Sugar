# sugar-core

This is the core package of the [Sugar](https://github.com/andrewplummer/Sugar)
library. It provides basic behavior as well as the ability to define new methods.
All Sugar npm packages depend on this package. Plugin developers can also depend
on it to define new methods for Sugar plugins.

## Documentation

#### [https://sugarjs.com/docs/](https://sugarjs.com/docs/)

Note: All define methods are called on the global (or exported object in npm),
and accept either a name and a function as two arguments or a single object
mapping names to functions.


## defineStatic

Defines a method to be called on the Sugar global or on a native global in
extended mode.


## defineInstance

Defines a method to be called on the Sugar global or as an instance method on
chainables or native objects in extended mode. All methods should accept the
instance object as their first argument, and should never refer to `this`.


## defineInstanceAndStatic

Defines a method to be called both as an instance and static method. This method
is required for Object methods, which must be defined as both static (as Sugar
will not extend `Object.prototype`) and instance (for chainables). Use this for
any methods intended as Object instance methods.


## defineStaticWithArguments

This method is identical to `defineStatic` except that when methods are called,
they will collect any arguments past `n - 1`, where `n` is the number of
arguments that the method accepts. Collected arguments will be passed to the
method as the last argument defined.


## defineInstanceWithArguments

This method is identical to `defineInstance` except that when methods are
called, they will collect any arguments past `n - 1`, where `n` is the number of
arguments that the method accepts. Collected arguments will be passed to the
method as the last argument defined.


## defineStaticPolyfill

Defines a static method that is mapped onto a native if it does not already
exist. Intended only for creating polyfills that follow the ECMAScript spec.


## defineInstancePolyfill

Defines an instance method that is mapped onto a native prototype if it does not
already exist. Intended only for creating polyfills that follow the ECMAScript
spec. Note that this method differs from `defineInstance` as there is no static
signature (as the method is mapped as-is to the native), so it should refer to
its `this` object.
