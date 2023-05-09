import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

export function default_avatar(user_id: string) {
    const avatar = createAvatar(identicon, {
        seed: user_id,
    });
    
    return avatar.toDataUri();
}