import React, { useEffect, useRef, useState } from 'react';

const VideoDescription = ({ videoId, video }) => {
    const [showFull, setShowFull] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    const parseText = (input) => {
        return input.split(/\n/).flatMap((line, i) => [
            ...line.split(/(\s+)/).map((part, index) => {
                if (part.startsWith('#')) {
                    const tag = part.substring(1);
                    return <a key={`${i}-${index}`} href={`/hashtag/${tag}`} className='hashtag' style={{ color: 'rgb(32,147,255)', fontWeight: '600' }}>{part}</a>;
                }
                if (part.startsWith('@')) {
                    const user = part.substring(1);
                    return <a key={`${i}-${index}`} href={`/user/${user}`} className='link-user'>{part}</a>;
                }
                return part;
            }),
            <br key={`br-${i}`} />
        ]);
    };

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const checkOverflow = () => {
            const isOver = el.scrollHeight > el.clientHeight + 2;
            setIsOverflowing(isOver);
        };

        checkOverflow();

        const observer = new ResizeObserver(checkOverflow);
        observer.observe(el);

        return () => observer.disconnect();
    }, [video.description]);

    return (
        <>
            <div
                ref={textRef}
                className={showFull ? 'description-full' : 'description'}
            >
                {parseText(video.description)}
            </div>

            {
                isOverflowing ? (
                    <div onClick={() => setShowFull(!showFull)} className="see-more-btn-more">
                        thêm
                    </div>
                ) :
                    (
                        <>
                            {
                                showFull ? (
                                    <div onClick={() => setShowFull(!showFull)} className="v-see-more-btn">
                                        Ẩn bớt
                                    </div >
                                ) : (
                                    <></>
                                )
                            }
                        </>
                    )
            }
        </>
    );
};

export default VideoDescription;
