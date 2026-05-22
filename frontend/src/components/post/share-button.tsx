import { sharePost } from '@/utils/share-post';
import { Share2 } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

type Props = {
    postId: string;
    title?: string;
};

const ShareButton = ({ postId, title }: Props) => {
    const handleShare = async () => {
        await sharePost({
            postId,
            title,
        });
    };
    return (
        <DropdownMenuItem
            onClick={handleShare}
        >
            <Share2 className='size-3.5' />
            Share this Post
        </DropdownMenuItem>
    );
}

export default ShareButton