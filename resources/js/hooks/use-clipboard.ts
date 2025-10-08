// Credit: https://usehooks-ts.com/
import { useCallback, useState } from 'react';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useClipboard(): [CopiedValue, CopyFn] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = useCallback(async (text) => {
        // Try modern Clipboard API first when available
        if (navigator?.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                setCopiedText(text);

                return true;
            } catch (error) {
                // Fall through to legacy fallback below
                console.warn('Clipboard API write failed, attempting fallback', error);
            }
        }

        // Legacy fallback using a temporary textarea and execCommand('copy')
        try {
            if (typeof document === 'undefined') {
                return false;
            }

            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);

            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (successful) {
                setCopiedText(text);
                return true;
            }

            console.warn('Fallback copy reported unsuccessful');
            setCopiedText(null);
            return false;
        } catch (error) {
            console.warn('Copy failed (fallback)', error);
            setCopiedText(null);

            return false;
        }
    }, []);

    return [copiedText, copy];
}
