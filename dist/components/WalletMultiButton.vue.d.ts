/// <reference types="@solana/web3.js" />
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
    featured: import("vue").Ref<number>;
    container: import("vue").Ref<string>;
    logo: import("vue").Ref<string | undefined>;
    dark: import("vue").Ref<boolean>;
    wallet: import("vue").Ref<import("@solana/wallet-adapter-base").Adapter | null>;
    publicKey: import("vue").Ref<import("@solana/web3.js").PublicKey | null>;
    publicKeyTrimmed: import("vue").ComputedRef<string | null>;
    publicKeyBase58: import("vue").ComputedRef<string | undefined>;
    canCopy: boolean;
    addressCopied: import("vue").ComputedRef<boolean>;
    dropdownPanel: import("vue").Ref<HTMLElement | undefined>;
    dropdownOpened: import("vue").Ref<boolean>;
    openDropdown: () => boolean;
    closeDropdown: () => boolean;
    copyAddress: () => "" | Promise<void> | undefined;
    disconnect: () => Promise<void>;
    scope: {
        featured: import("vue").Ref<number>;
        container: import("vue").Ref<string>;
        logo: import("vue").Ref<string | undefined>;
        dark: import("vue").Ref<boolean>;
        wallet: import("vue").Ref<import("@solana/wallet-adapter-base").Adapter | null>;
        publicKey: import("vue").Ref<import("@solana/web3.js").PublicKey | null>;
        publicKeyTrimmed: import("vue").ComputedRef<string | null>;
        publicKeyBase58: import("vue").ComputedRef<string | undefined>;
        canCopy: boolean;
        addressCopied: import("vue").ComputedRef<boolean>;
        dropdownPanel: import("vue").Ref<HTMLElement | undefined>;
        dropdownOpened: import("vue").Ref<boolean>;
        openDropdown: () => boolean;
        closeDropdown: () => boolean;
        copyAddress: () => "" | Promise<void> | undefined;
        disconnect: () => Promise<void>;
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
