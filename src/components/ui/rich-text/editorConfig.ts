
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

// Export the TipTap extensions configuration
export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
  }),
];
