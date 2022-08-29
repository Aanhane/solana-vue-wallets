declare const _default: import("vue").DefineComponent<{
    disabled: BooleanConstructor;
}, {
    wallet: import("vue").Ref<import("@solana/wallet-adapter-base").Adapter | null>;
    disconnecting: import("vue").Ref<boolean>;
    disabled: import("vue").Ref<boolean>;
    content: import("vue").ComputedRef<"Disconnecting ..." | "Disconnect" | "Disconnect Wallet">;
    handleClick: (event: MouseEvent) => void;
    scope: {
        wallet: import("vue").Ref<import("@solana/wallet-adapter-base").Adapter | null>;
        disconnecting: import("vue").Ref<boolean>;
        disabled: import("vue").Ref<boolean>;
        content: import("vue").ComputedRef<"Disconnecting ..." | "Disconnect" | "Disconnect Wallet">;
        handleClick: (event: MouseEvent) => void;
    };
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: BooleanConstructor;
}>>, {
    disabled: boolean;
}>;
export default _default;
