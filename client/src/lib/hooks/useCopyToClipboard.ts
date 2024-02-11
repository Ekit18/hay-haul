import { NotificationInstance } from 'antd/es/notification/interface';

type CopyFn = (text: string) => Promise<boolean>;

type useCopyToClipboardProps = {
  api: NotificationInstance;
};

export function useCopyToClipboard({ api }: useCopyToClipboardProps): CopyFn {
  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      api.error({ message: 'Copy failed', description: 'Clipboard not supported', placement: 'topRight' });
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      api.success({
        message: 'Copied to Clipboard',
        description: 'The text has been successfully copied to your clipboard.',
        placement: 'topRight'
      });

      return true;
    } catch (error) {
      api.error({ message: 'Copy failed', description: 'Something went wrong', placement: 'topRight' });
      return false;
    }
  };

  return copy;
}
