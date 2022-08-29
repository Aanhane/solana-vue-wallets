var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { WalletError, WalletReadyState, WalletNotConnectedError, WalletNotReadyError } from "@solana/wallet-adapter-base";
import { getCurrentScope, onScopeDispose, ref, unref, watch, computed, shallowRef, watchEffect, defineComponent, toRefs, openBlock, createElementBlock, createCommentVNode, resolveComponent, renderSlot, normalizeProps, guardReactiveProps, createElementVNode, createBlock, toDisplayString, nextTick, Fragment, normalizeClass, Teleport, withModifiers, renderList, createVNode, createTextVNode, withCtx, normalizeStyle } from "vue";
class WalletNotSelectedError extends WalletError {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "WalletNotSelectedError");
  }
}
class WalletNotInitializedError extends WalletError {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "WalletNotSelectedError");
  }
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
const isClient = typeof window !== "undefined";
const isString = (val) => typeof val === "string";
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args });
  }
  return wrapper;
}
const bypassFilter = (invoke) => {
  return invoke();
};
var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
var __objRest$5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$9.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$9)
    for (var prop of __getOwnPropSymbols$9(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$9.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function watchWithFilter(source, cb, options = {}) {
  const _a2 = options, {
    eventFilter = bypassFilter
  } = _a2, watchOptions = __objRest$5(_a2, [
    "eventFilter"
  ]);
  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
function useTimeoutFn(cb, interval, options = {}) {
  const {
    immediate = true
  } = options;
  const isPending = ref(false);
  let timer = null;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.value = false;
    clear();
  }
  function start(...args) {
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = null;
      cb(...args);
    }, unref(interval));
  }
  if (immediate) {
    isPending.value = true;
    if (isClient)
      start();
  }
  tryOnScopeDispose(stop);
  return {
    isPending,
    start,
    stop
  };
}
function unrefElement(elRef) {
  var _a2;
  const plain = unref(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
const defaultWindow = isClient ? window : void 0;
isClient ? window.document : void 0;
const defaultNavigator = isClient ? window.navigator : void 0;
isClient ? window.location : void 0;
function useEventListener(...args) {
  let target;
  let event;
  let listener;
  let options;
  if (isString(args[0])) {
    [event, listener, options] = args;
    target = defaultWindow;
  } else {
    [target, event, listener, options] = args;
  }
  if (!target)
    return noop;
  let cleanup = noop;
  const stopWatch = watch(() => unref(target), (el) => {
    cleanup();
    if (!el)
      return;
    el.addEventListener(event, listener, options);
    cleanup = () => {
      el.removeEventListener(event, listener, options);
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow } = options;
  if (!window2)
    return;
  const shouldListen = ref(true);
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el) || !shouldListen.value)
      return;
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture: true }),
    useEventListener(window2, "pointerdown", (e) => {
      const el = unrefElement(target);
      shouldListen.value = !!el && !e.composedPath().includes(el);
    }, { passive: true })
  ];
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
const createKeyPredicate = (keyFilter) => {
  if (typeof keyFilter === "function")
    return keyFilter;
  else if (typeof keyFilter === "string")
    return (event) => event.key === keyFilter;
  else if (Array.isArray(keyFilter))
    return (event) => keyFilter.includes(event.key);
  else if (keyFilter)
    return () => true;
  else
    return () => false;
};
function onKeyStroke(key, handler, options = {}) {
  const { target = defaultWindow, eventName = "keydown", passive = false } = options;
  const predicate = createKeyPredicate(key);
  const listener = (e) => {
    if (predicate(e))
      handler(e);
  };
  return useEventListener(target, eventName, listener, passive);
}
function useClipboard(options = {}) {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500
  } = options;
  const events = ["copy", "cut"];
  const isSupported = Boolean(navigator && "clipboard" in navigator);
  const text = ref("");
  const copied = ref(false);
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring);
  function updateText() {
    navigator.clipboard.readText().then((value) => {
      text.value = value;
    });
  }
  if (isSupported && read) {
    for (const event of events)
      useEventListener(event, updateText);
  }
  async function copy(value = unref(source)) {
    if (isSupported && value != null) {
      await navigator.clipboard.writeText(value);
      text.value = value;
      copied.value = true;
      timeout.start();
    }
  }
  return {
    isSupported,
    text,
    copied,
    copy
  };
}
const _global = typeof globalThis === "undefined" ? void 0 : globalThis;
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
const handlers = _global[globalKey];
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : Array.isArray(rawInit) ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
const StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  }
};
function useStorage(key, initialValue, storage, options = {}) {
  var _a2;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    }
  } = options;
  const rawInit = unref(initialValue);
  const type = guessSerializerType(rawInit);
  const data = (shallow ? shallowRef : ref)(initialValue);
  const serializer = (_a2 = options.serializer) != null ? _a2 : StorageSerializers[type];
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a22;
        return (_a22 = defaultWindow) == null ? void 0 : _a22.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    if (!storage || event && event.key !== key)
      return;
    try {
      const rawValue = event ? event.newValue : storage.getItem(key);
      if (rawValue == null) {
        data.value = rawInit;
        if (writeDefaults && rawInit !== null)
          storage.setItem(key, serializer.write(rawInit));
      } else if (typeof rawValue !== "string") {
        data.value = rawValue;
      } else {
        data.value = serializer.read(rawValue);
      }
    } catch (e) {
      onError(e);
    }
  }
  read();
  if (window2 && listenToStorageChanges)
    useEventListener(window2, "storage", (e) => setTimeout(() => read(e), 0));
  if (storage) {
    watchWithFilter(data, () => {
      try {
        if (data.value == null)
          storage.removeItem(key);
        else
          storage.setItem(key, serializer.write(data.value));
      } catch (e) {
        onError(e);
      }
    }, {
      flush,
      deep,
      eventFilter
    });
  }
  return data;
}
function useLocalStorage(key, initialValue, options = {}) {
  const { window: window2 = defaultWindow } = options;
  return useStorage(key, initialValue, window2 == null ? void 0 : window2.localStorage, options);
}
var _a, _b;
function preventDefault(rawEvent) {
  const e = rawEvent || window.event;
  if (e.touches.length > 1)
    return true;
  if (e.preventDefault)
    e.preventDefault();
  return false;
}
const isIOS = isClient && (window == null ? void 0 : window.navigator) && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.platform) && /iP(ad|hone|od)/.test((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.platform);
function useScrollLock(element, initialState = false) {
  const isLocked = ref(initialState);
  let touchMoveListener = null;
  let initialOverflow;
  const lock = () => {
    const ele = unref(element);
    if (!ele || isLocked.value)
      return;
    initialOverflow = ele.style.overflow;
    if (isIOS) {
      touchMoveListener = useEventListener(document, "touchmove", preventDefault, { passive: false });
    }
    ele.style.overflow = "hidden";
    isLocked.value = true;
  };
  const unlock = () => {
    const ele = unref(element);
    if (!ele || !isLocked.value)
      return;
    isIOS && (touchMoveListener == null ? void 0 : touchMoveListener());
    ele.style.overflow = initialOverflow;
    isLocked.value = false;
  };
  return computed({
    get() {
      return isLocked.value;
    },
    set(v) {
      if (v)
        lock();
      else
        unlock();
    }
  });
}
var __defProp$3 = Object.defineProperty;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
const initialRect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 0,
  width: 0
};
__spreadValues$3({
  text: ""
}, initialRect);
const createWalletStore = ({
  wallets: initialWallets = [],
  autoConnect: initialAutoConnect = false,
  onError = (error) => console.error(error),
  localStorageKey = "walletName"
}) => {
  const wallets = shallowRef(initialWallets);
  const autoConnect = ref(initialAutoConnect);
  const name = useLocalStorage(localStorageKey, null);
  const wallet = shallowRef(null);
  const publicKey = ref(null);
  const readyState = ref(WalletReadyState.NotDetected);
  const connected = ref(false);
  const connecting = ref(false);
  const disconnecting = ref(false);
  const ready = computed(() => readyState.value === WalletReadyState.Installed || readyState.value === WalletReadyState.Loadable);
  const setWallet = (newWallet) => {
    var _a2, _b2, _c;
    wallet.value = newWallet;
    readyState.value = (_a2 = newWallet == null ? void 0 : newWallet.readyState) != null ? _a2 : WalletReadyState.NotDetected;
    publicKey.value = (_b2 = newWallet == null ? void 0 : newWallet.publicKey) != null ? _b2 : null;
    connected.value = (_c = newWallet == null ? void 0 : newWallet.connected) != null ? _c : false;
  };
  const newError = (error) => {
    onError(error);
    return error;
  };
  const walletsByName = computed(() => {
    return wallets.value.reduce((walletsByName2, wallet2) => {
      walletsByName2[wallet2.name] = wallet2;
      return walletsByName2;
    }, {});
  });
  watch(name, () => {
    var _a2, _b2;
    setWallet((_b2 = (_a2 = walletsByName.value) == null ? void 0 : _a2[name.value]) != null ? _b2 : null);
  }, { immediate: true });
  const select = async (walletName) => {
    if (name.value === walletName)
      return;
    name.value = walletName;
  };
  const onReadyStateChange = () => setWallet(wallet.value);
  const onConnect = () => setWallet(wallet.value);
  const onDisconnect = () => name.value = null;
  const invalidateListeners = watchEffect((onInvalidate) => {
    const _wallet = wallet.value;
    if (!_wallet)
      return;
    _wallet.on("readyStateChange", onReadyStateChange);
    _wallet.on("connect", onConnect);
    _wallet.on("disconnect", onDisconnect);
    _wallet.on("error", onError);
    onInvalidate(() => {
      _wallet.off("readyStateChange", onReadyStateChange);
      _wallet.off("connect", onConnect);
      _wallet.off("disconnect", onDisconnect);
      _wallet.off("error", onError);
    });
  });
  if (typeof window !== "undefined") {
    window.addEventListener("unload", invalidateListeners);
  }
  const connect = async () => {
    if (connected.value || connecting.value || disconnecting.value)
      return;
    if (!wallet.value)
      throw newError(new WalletNotSelectedError());
    if (!ready.value) {
      name.value = null;
      if (typeof window !== "undefined") {
        window.open(wallet.value.url, "_blank");
      }
      throw newError(new WalletNotReadyError());
    }
    try {
      connecting.value = true;
      await wallet.value.connect();
    } catch (error) {
      name.value = null;
      throw error;
    } finally {
      connecting.value = false;
    }
  };
  const disconnect = async () => {
    if (disconnecting.value)
      return;
    if (!wallet.value) {
      name.value = null;
      return;
    }
    try {
      disconnecting.value = true;
      await wallet.value.disconnect();
    } finally {
      name.value = null;
      disconnecting.value = false;
    }
  };
  const sendTransaction = async (transaction, connection, options) => {
    if (!wallet.value)
      throw newError(new WalletNotSelectedError());
    if (!connected.value)
      throw newError(new WalletNotConnectedError());
    return await wallet.value.sendTransaction(transaction, connection, options);
  };
  const signTransaction = computed(() => {
    const _wallet = wallet.value;
    if (!(_wallet && "signTransaction" in _wallet))
      return;
    return async (transaction) => {
      if (!connected.value)
        throw newError(new WalletNotConnectedError());
      return await _wallet.signTransaction(transaction);
    };
  });
  const signAllTransactions = computed(() => {
    const _wallet = wallet.value;
    if (!(_wallet && "signAllTransactions" in _wallet))
      return;
    return async (transactions) => {
      if (!connected.value)
        throw newError(new WalletNotConnectedError());
      return await _wallet.signAllTransactions(transactions);
    };
  });
  const signMessage = computed(() => {
    const _wallet = wallet.value;
    if (!(_wallet && "signMessage" in _wallet))
      return;
    return async (message) => {
      if (!connected.value)
        throw newError(new WalletNotConnectedError());
      return await _wallet.signMessage(message);
    };
  });
  watchEffect(async () => {
    if (!autoConnect.value || !wallet.value || !ready.value || connected.value || connecting.value)
      return;
    try {
      connecting.value = true;
      await wallet.value.connect();
    } catch (error) {
      name.value = null;
    } finally {
      connecting.value = false;
    }
  });
  return {
    wallets,
    autoConnect,
    wallet,
    publicKey,
    readyState,
    ready,
    connected,
    connecting,
    disconnecting,
    select,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage
  };
};
let walletStore = null;
const useWallet = () => {
  if (walletStore)
    return walletStore;
  throw new WalletNotInitializedError("Wallet not initialized. Please use the `initWallet` method to initialize the wallet.");
};
const initWallet = (walletStoreProps) => {
  walletStore = createWalletStore(walletStoreProps);
};
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = defineComponent({
  props: {
    wallet: Object
  },
  setup(props) {
    return toRefs(props);
  }
});
const _hoisted_1$4 = { class: "swv-button-icon" };
const _hoisted_2$4 = ["src", "alt"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("i", _hoisted_1$4, [
    _ctx.wallet ? (openBlock(), createElementBlock("img", {
      key: 0,
      src: _ctx.wallet.icon,
      alt: `${_ctx.wallet.name} icon`
    }, null, 8, _hoisted_2$4)) : createCommentVNode("", true)
  ]);
}
var WalletIcon = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = defineComponent({
  components: {
    WalletIcon
  },
  props: {
    disabled: Boolean
  },
  setup(props, { emit }) {
    const { disabled } = toRefs(props);
    const { wallet, connect, connecting, connected } = useWallet();
    const content = computed(() => {
      if (connecting.value)
        return "Connecting ...";
      if (connected.value)
        return "Connected";
      if (wallet.value)
        return "Connect";
      return "Connect Wallet";
    });
    const onClick = (event) => {
      emit("click", event);
      if (event.defaultPrevented)
        return;
      connect().catch(() => {
      });
    };
    const scope = {
      wallet,
      disabled,
      connecting,
      connected,
      content,
      onClick
    };
    return __spreadValues({
      scope
    }, scope);
  }
});
const _hoisted_1$3 = ["disabled"];
const _hoisted_2$3 = ["textContent"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wallet_icon = resolveComponent("wallet-icon");
  return renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(_ctx.scope)), () => [
    createElementVNode("button", {
      class: "swv-button swv-button-trigger",
      disabled: _ctx.disabled || !_ctx.wallet || _ctx.connecting || _ctx.connected,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, [
      _ctx.wallet ? (openBlock(), createBlock(_component_wallet_icon, {
        key: 0,
        wallet: _ctx.wallet
      }, null, 8, ["wallet"])) : createCommentVNode("", true),
      createElementVNode("p", {
        textContent: toDisplayString(_ctx.content)
      }, null, 8, _hoisted_2$3)
    ], 8, _hoisted_1$3)
  ]);
}
var WalletConnectButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = defineComponent({
  components: {
    WalletIcon
  },
  props: {
    disabled: Boolean
  },
  setup(props, { emit }) {
    const { disabled } = toRefs(props);
    const { wallet, disconnect, disconnecting } = useWallet();
    const content = computed(() => {
      if (disconnecting.value)
        return "Disconnecting ...";
      if (wallet.value)
        return "Disconnect";
      return "Disconnect Wallet";
    });
    const handleClick = (event) => {
      emit("click", event);
      if (event.defaultPrevented)
        return;
      disconnect().catch(() => {
      });
    };
    const scope = {
      wallet,
      disconnecting,
      disabled,
      content,
      handleClick
    };
    return __spreadValues({
      scope
    }, scope);
  }
});
const _hoisted_1$2 = ["disabled"];
const _hoisted_2$2 = ["textContent"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wallet_icon = resolveComponent("wallet-icon");
  return renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(_ctx.scope)), () => [
    createElementVNode("button", {
      class: "swv-button swv-button-trigger",
      disabled: _ctx.disabled || _ctx.disconnecting || !_ctx.wallet,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      _ctx.wallet ? (openBlock(), createBlock(_component_wallet_icon, {
        key: 0,
        wallet: _ctx.wallet
      }, null, 8, ["wallet"])) : createCommentVNode("", true),
      createElementVNode("p", {
        textContent: toDisplayString(_ctx.content)
      }, null, 8, _hoisted_2$2)
    ], 8, _hoisted_1$2)
  ]);
}
var WalletDisconnectButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = defineComponent({
  components: {
    WalletIcon
  },
  props: {
    featured: { type: Number, default: 3 },
    container: { type: String, default: "body" },
    logo: String,
    dark: Boolean
  },
  setup(props, { slots }) {
    const { featured, container, logo, dark } = toRefs(props);
    const modalPanel = ref(null);
    const modalOpened = ref(false);
    const openModal = () => modalOpened.value = true;
    const closeModal = () => modalOpened.value = false;
    const hasLogo = computed(() => !!slots.logo || !!logo.value);
    const { wallets, select: selectWallet } = useWallet();
    const expandedWallets = ref(false);
    const featuredWallets = computed(() => wallets.value.slice(0, featured.value));
    const hiddenWallets = computed(() => wallets.value.slice(featured.value));
    const walletsToDisplay = computed(() => expandedWallets.value ? wallets.value : featuredWallets.value);
    onClickOutside(modalPanel, closeModal);
    onKeyStroke("Escape", closeModal);
    onKeyStroke("Tab", (event) => {
      var _a2, _b2;
      const focusableElements = (_b2 = (_a2 = modalPanel.value) == null ? void 0 : _a2.querySelectorAll("button")) != null ? _b2 : [];
      const firstElement = focusableElements == null ? void 0 : focusableElements[0];
      const lastElement = focusableElements == null ? void 0 : focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement && lastElement) {
        lastElement.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === lastElement && firstElement) {
        firstElement.focus();
        event.preventDefault();
      }
    });
    watch(modalOpened, (isOpened) => {
      if (!isOpened)
        return;
      nextTick(() => {
        var _a2, _b2, _c;
        return (_c = (_b2 = (_a2 = modalPanel.value) == null ? void 0 : _a2.querySelectorAll("button")) == null ? void 0 : _b2[0]) == null ? void 0 : _c.focus();
      });
    });
    const scrollLock = useScrollLock(document.body);
    watch(modalOpened, (isOpened) => scrollLock.value = isOpened);
    const scope = {
      dark,
      logo,
      hasLogo,
      featured,
      container,
      modalPanel,
      modalOpened,
      openModal,
      closeModal,
      expandedWallets,
      walletsToDisplay,
      featuredWallets,
      hiddenWallets,
      selectWallet
    };
    return __spreadValues({
      scope
    }, scope);
  }
});
const _hoisted_1$1 = /* @__PURE__ */ createElementVNode("div", { class: "swv-modal-overlay" }, null, -1);
const _hoisted_2$1 = {
  class: "swv-modal-container",
  ref: "modalPanel"
};
const _hoisted_3$1 = {
  key: 0,
  class: "swv-modal-logo-wrapper"
};
const _hoisted_4$1 = ["src"];
const _hoisted_5$1 = /* @__PURE__ */ createElementVNode("h1", {
  class: "swv-modal-title",
  id: "swv-modal-title"
}, " Connect Wallet ", -1);
const _hoisted_6 = /* @__PURE__ */ createElementVNode("svg", {
  width: "14",
  height: "14"
}, [
  /* @__PURE__ */ createElementVNode("path", { d: "M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z" })
], -1);
const _hoisted_7 = [
  _hoisted_6
];
const _hoisted_8 = { class: "swv-modal-list" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = { class: "swv-button" };
const _hoisted_11 = ["textContent"];
const _hoisted_12 = ["aria-expanded"];
const _hoisted_13 = /* @__PURE__ */ createElementVNode("i", { class: "swv-button-icon" }, [
  /* @__PURE__ */ createElementVNode("svg", {
    width: "11",
    height: "6",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /* @__PURE__ */ createElementVNode("path", { d: "m5.938 5.73 4.28-4.126a.915.915 0 0 0 0-1.322 1 1 0 0 0-1.371 0L5.253 3.736 1.659.272a1 1 0 0 0-1.371 0A.93.93 0 0 0 0 .932c0 .246.1.48.288.662l4.28 4.125a.99.99 0 0 0 1.37.01z" })
  ])
], -1);
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wallet_icon = resolveComponent("wallet-icon");
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.dark ? "swv-dark" : "")
    }, [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(_ctx.scope)))
    ], 2),
    _ctx.modalOpened ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: _ctx.container
    }, [
      createElementVNode("div", {
        "aria-labelledby": "swv-modal-title",
        "aria-modal": "true",
        class: normalizeClass(["swv-modal", _ctx.dark ? "swv-dark" : ""]),
        role: "dialog"
      }, [
        renderSlot(_ctx.$slots, "overlay", normalizeProps(guardReactiveProps(_ctx.scope)), () => [
          _hoisted_1$1
        ]),
        createElementVNode("div", _hoisted_2$1, [
          renderSlot(_ctx.$slots, "modal", normalizeProps(guardReactiveProps(_ctx.scope)), () => [
            createElementVNode("div", {
              class: normalizeClass(["swv-modal-wrapper", { "swv-modal-wrapper-no-logo": !_ctx.hasLogo }])
            }, [
              _ctx.hasLogo ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
                renderSlot(_ctx.$slots, "logo", normalizeProps(guardReactiveProps(_ctx.scope)), () => [
                  createElementVNode("img", {
                    alt: "logo",
                    class: "swv-modal-logo",
                    src: _ctx.logo
                  }, null, 8, _hoisted_4$1)
                ])
              ])) : createCommentVNode("", true),
              _hoisted_5$1,
              createElementVNode("button", {
                onClick: _cache[0] || (_cache[0] = withModifiers((...args) => _ctx.closeModal && _ctx.closeModal(...args), ["prevent"])),
                class: "swv-modal-button-close"
              }, _hoisted_7),
              createElementVNode("ul", _hoisted_8, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.walletsToDisplay, (wallet) => {
                  return openBlock(), createElementBlock("li", {
                    key: wallet.name,
                    onClick: ($event) => {
                      _ctx.selectWallet(wallet.name);
                      _ctx.closeModal();
                    }
                  }, [
                    createElementVNode("button", _hoisted_10, [
                      createElementVNode("p", {
                        textContent: toDisplayString(wallet.name)
                      }, null, 8, _hoisted_11),
                      createVNode(_component_wallet_icon, { wallet }, null, 8, ["wallet"])
                    ])
                  ], 8, _hoisted_9);
                }), 128))
              ]),
              _ctx.hiddenWallets.length > 0 ? (openBlock(), createElementBlock("button", {
                key: 1,
                "aria-controls": "swv-modal-collapse",
                "aria-expanded": _ctx.expandedWallets,
                class: normalizeClass(["swv-button swv-modal-collapse-button", { "swv-modal-collapse-button-active": _ctx.expandedWallets }]),
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.expandedWallets = !_ctx.expandedWallets)
              }, [
                createTextVNode(toDisplayString(_ctx.expandedWallets ? "Less" : "More") + " options ", 1),
                _hoisted_13
              ], 10, _hoisted_12)) : createCommentVNode("", true)
            ], 2)
          ])
        ], 512)
      ], 2)
    ], 8, ["to"])) : createCommentVNode("", true)
  ], 64);
}
var WalletModalProvider = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = defineComponent({
  components: {
    WalletConnectButton,
    WalletIcon,
    WalletModalProvider
  },
  props: {
    featured: { type: Number, default: 3 },
    container: { type: String, default: "body" },
    logo: String,
    dark: Boolean
  },
  setup(props) {
    const { featured, container, logo, dark } = toRefs(props);
    const { publicKey, wallet, disconnect } = useWallet();
    const dropdownPanel = ref();
    const dropdownOpened = ref(false);
    const openDropdown = () => dropdownOpened.value = true;
    const closeDropdown = () => dropdownOpened.value = false;
    onClickOutside(dropdownPanel, closeDropdown);
    const publicKeyBase58 = computed(() => {
      var _a2;
      return (_a2 = publicKey.value) == null ? void 0 : _a2.toBase58();
    });
    const publicKeyTrimmed = computed(() => {
      if (!wallet.value || !publicKeyBase58.value)
        return null;
      return publicKeyBase58.value.slice(0, 4) + ".." + publicKeyBase58.value.slice(-4);
    });
    const { copy, copied: addressCopied, isSupported: canCopy } = useClipboard();
    const copyAddress = () => publicKeyBase58.value && copy(publicKeyBase58.value);
    const scope = {
      featured,
      container,
      logo,
      dark,
      wallet,
      publicKey,
      publicKeyTrimmed,
      publicKeyBase58,
      canCopy,
      addressCopied,
      dropdownPanel,
      dropdownOpened,
      openDropdown,
      closeDropdown,
      copyAddress,
      disconnect
    };
    return __spreadValues({
      scope
    }, scope);
  }
});
const _hoisted_1 = ["onClick"];
const _hoisted_2 = {
  key: 2,
  class: "swv-dropdown"
};
const _hoisted_3 = ["aria-expanded", "title"];
const _hoisted_4 = ["textContent"];
const _hoisted_5 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_wallet_connect_button = resolveComponent("wallet-connect-button");
  const _component_wallet_icon = resolveComponent("wallet-icon");
  const _component_wallet_modal_provider = resolveComponent("wallet-modal-provider");
  return openBlock(), createBlock(_component_wallet_modal_provider, {
    featured: _ctx.featured,
    container: _ctx.container,
    logo: _ctx.logo,
    dark: _ctx.dark
  }, {
    default: withCtx((modalScope) => [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(__spreadValues(__spreadValues({}, modalScope), _ctx.scope))), () => [
        !_ctx.wallet ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "swv-button swv-button-trigger",
          onClick: modalScope.openModal
        }, " Select Wallet ", 8, _hoisted_1)) : !_ctx.publicKeyBase58 ? (openBlock(), createBlock(_component_wallet_connect_button, { key: 1 })) : (openBlock(), createElementBlock("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "dropdown-button", normalizeProps(guardReactiveProps(__spreadValues(__spreadValues({}, modalScope), _ctx.scope))), () => [
            createElementVNode("button", {
              class: "swv-button swv-button-trigger",
              style: normalizeStyle({ pointerEvents: _ctx.dropdownOpened ? "none" : "auto" }),
              "aria-expanded": _ctx.dropdownOpened,
              title: _ctx.publicKeyBase58,
              onClick: _cache[0] || (_cache[0] = (...args) => _ctx.openDropdown && _ctx.openDropdown(...args))
            }, [
              createVNode(_component_wallet_icon, { wallet: _ctx.wallet }, null, 8, ["wallet"]),
              createElementVNode("p", {
                textContent: toDisplayString(_ctx.publicKeyTrimmed)
              }, null, 8, _hoisted_4)
            ], 12, _hoisted_3)
          ]),
          renderSlot(_ctx.$slots, "dropdown", normalizeProps(guardReactiveProps(__spreadValues(__spreadValues({}, modalScope), _ctx.scope))), () => [
            createElementVNode("ul", {
              "aria-label": "dropdown-list",
              class: normalizeClass(["swv-dropdown-list", { "swv-dropdown-list-active": _ctx.dropdownOpened }]),
              ref: "dropdownPanel",
              role: "menu"
            }, [
              renderSlot(_ctx.$slots, "dropdown-list", normalizeProps(guardReactiveProps(__spreadValues(__spreadValues({}, modalScope), _ctx.scope))), () => [
                _ctx.canCopy ? (openBlock(), createElementBlock("li", {
                  key: 0,
                  onClick: _cache[1] || (_cache[1] = (...args) => _ctx.copyAddress && _ctx.copyAddress(...args)),
                  class: "swv-dropdown-list-item",
                  role: "menuitem"
                }, toDisplayString(_ctx.addressCopied ? "Copied" : "Copy address"), 1)) : createCommentVNode("", true),
                createElementVNode("li", {
                  onClick: ($event) => {
                    modalScope.openModal();
                    _ctx.closeDropdown();
                  },
                  class: "swv-dropdown-list-item",
                  role: "menuitem"
                }, " Change wallet ", 8, _hoisted_5),
                createElementVNode("li", {
                  onClick: _cache[2] || (_cache[2] = (...args) => _ctx.disconnect && _ctx.disconnect(...args)),
                  class: "swv-dropdown-list-item",
                  role: "menuitem"
                }, " Disconnect ")
              ])
            ], 2)
          ])
        ]))
      ])
    ]),
    overlay: withCtx((modalScope) => [
      renderSlot(_ctx.$slots, "modal-overlay", normalizeProps(guardReactiveProps(__spreadValues(__spreadValues({}, modalScope), _ctx.scope))))
    ]),
    modal: withCtx((modalScope) => [
      renderSlot(_ctx.$slots, "modal", normalizeProps(guardReactiveProps(__spreadValues(__spreadValues({}, modalScope), _ctx.scope))))
    ]),
    _: 3
  }, 8, ["featured", "container", "logo", "dark"]);
}
var WalletMultiButton = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
function useAnchorWallet() {
  const walletStore2 = useWallet();
  return computed(() => {
    if (!walletStore2)
      return;
    const { signTransaction, signAllTransactions, publicKey } = walletStore2;
    if (!publicKey.value || !signTransaction.value || !signAllTransactions.value)
      return;
    return {
      publicKey: publicKey.value,
      signTransaction: signTransaction.value,
      signAllTransactions: signAllTransactions.value
    };
  });
}
var index = {
  install: (app, options = {}) => {
    initWallet(options);
    app.config.globalProperties.$wallet = useWallet();
  }
};
export { WalletConnectButton, WalletDisconnectButton, WalletIcon, WalletModalProvider, WalletMultiButton, WalletNotInitializedError, WalletNotSelectedError, createWalletStore, index as default, initWallet, useAnchorWallet, useWallet };
//# sourceMappingURL=solana-wallets-vue.es.js.map
