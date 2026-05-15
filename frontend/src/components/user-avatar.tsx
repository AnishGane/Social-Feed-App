import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type Props = {
    seed?: string;
    className: string
}

const UserAvatar = ({ seed = 'John Doe', className }: Props) => {

    const avatar = useMemo(() => {
        return createAvatar(lorelei, {
            seed,
            size: 128,
            // ... other options
        }).toDataUri();
    }, [seed]);

    return (
        <Avatar className={cn("rounded-lg", className)}>
            <AvatarImage src={avatar} alt="Avatar" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar