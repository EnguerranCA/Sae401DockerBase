import React, { useState } from 'react';
import { cva } from "class-variance-authority";
import { config } from '../../config/config';
import Avatar from '../../ui/Avatar';
import SubmitButton from '../../ui/Buttons/SubmitButton';
import Users from '../../data/data-users';
import Posts from '../../data/data-posts';

const { UPLOADS_URL } = config;

interface ReplyFormProps {
    tweetId: number;
    onReplyPosted: () => void;
    className?: string;
    variant?: 'default' | 'compact';
    user: {
        avatar: string;
        name: string;
        username: string;
    };
}

const replyFormStyles = cva(
    "flex flex-col gap-2",
    {
        variants: {
            variant: {
                default: "p-4 bg-white rounded-lg border border-lightborder",
                compact: "p-2",
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const ReplyForm: React.FC<ReplyFormProps> = ({ tweetId, onReplyPosted, className = '', variant, user }) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await Posts.replyToTweet(tweetId, message);
            setMessage('');
            onReplyPosted();
        } catch (error) {
            console.error('Error posting reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`${replyFormStyles({ variant })} ${className}`}>
            <div className="flex gap-2">
                <Avatar
                    src={`${UPLOADS_URL}/avatars/${user.avatar}`}
                    alt={user.username}
                    size={48}
                />
                <textarea
                    className="flex-1 p-2 border rounded-lg resize-none"
                    placeholder="Write your reply..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="flex justify-end">
                <SubmitButton
                    text="Reply"
                    disabled={!message.trim() || isSubmitting}
                />
            </div>
        </form>
    );
};

export default ReplyForm; 