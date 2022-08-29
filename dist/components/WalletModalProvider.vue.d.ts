declare const _default: import("vue").DefineComponent<{
    featured: {
        type: NumberConstructor;
        default: number;
    };
    container: {
        type: StringConstructor;
        default: string;
    };
    logo: StringConstructor;
    dark: BooleanConstructor;
}, {
    dark: import("vue").Ref<boolean>;
    logo: import("vue").Ref<string | undefined>;
    hasLogo: import("vue").ComputedRef<boolean>;
    featured: import("vue").Ref<number>;
    container: import("vue").Ref<string>;
    modalPanel: import("vue").Ref<HTMLElement | null>;
    modalOpened: import("vue").Ref<boolean>;
    openModal: () => boolean;
    closeModal: () => boolean;
    expandedWallets: import("vue").Ref<boolean>;
    walletsToDisplay: import("vue").ComputedRef<import("@solana/wallet-adapter-base").Adapter[]>;
    featuredWallets: import("vue").ComputedRef<import("@solana/wallet-adapter-base").Adapter[]>;
    hiddenWallets: import("vue").ComputedRef<import("@solana/wallet-adapter-base").Adapter[]>;
    selectWallet: (walletName: import("@solana/wallet-adapter-base").WalletName) => void;
    scope: {
        dark: import("vue").Ref<boolean>;
        logo: import("vue").Ref<string | undefined>;
        hasLogo: import("vue").ComputedRef<boolean>;
        featured: import("vue").Ref<number>;
        container: import("vue").Ref<string>;
        modalPanel: import("vue").Ref<HTMLElement | null>;
        modalOpened: import("vue").Ref<boolean>;
        openModal: () => boolean;
        closeModal: () => boolean;
        expandedWallets: import("vue").Ref<boolean>;
        walletsToDisplay: import("vue").ComputedRef<import("@solana/wallet-adapter-base").Adapter[]>;
        featuredWallets: import("vue").ComputedRef<import("@solana/wallet-adapter-base").Adapter[]>;
        hiddenWallets: import("vue").ComputedRef<import("@solana/wallet-adapter-base").Adapter[]>;
        selectWallet: (walletName: import("@solana/wallet-adapter-base").WalletName) => void;
    };
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    featured: {
        type: NumberConstructor;
        default: number;
    };
    container: {
        type: StringConstructor;
        default: string;
    };
    logo: StringConstructor;
    dark: BooleanConstructor;
}>>, {
    dark: boolean;
    featured: number;
    container: string;
}>;
export default _default;
