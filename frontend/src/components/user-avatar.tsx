import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const UserAvatar = ({ seed = 'John Doe' }) => {

    const avatar = useMemo(() => {
        return createAvatar(lorelei, {
            seed,
            size: 128,
            // ... other options
        }).toDataUri();
    }, [seed]);

    return (
        <Avatar className="size-8 rounded-lg">
            <AvatarImage src={avatar} alt="Avatar" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar