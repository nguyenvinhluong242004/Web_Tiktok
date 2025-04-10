import { useEffect, useRef, useState } from 'react';

const Description = ({ video, videoId, text }) => {
    const [showFull, setShowFull] = useState(false);
    const [checkshowFull, setcheckShowFull] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    // Tự động chèn thẻ <a> cho #hashtag và @mention
    const parseText = (input) => {
        return input.split(/\n/).flatMap((line, i) => [
            ...line.split(/(\s+)/).map((part, index) => {
                if (part.startsWith('#')) {
                    const tag = part.substring(1);
                    return <a key={`${i}-${index}`} href={`/hashtag/${tag}`} className='hashtag'>{part}</a>;
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
        if (video.id !== videoId) return;
        const el = textRef.current;
        if (!el) return;

        const checkOverflow = () => {
            const isOver = el.scrollHeight > el.clientHeight + 2; // cộng 2 để dư một tí cho an toàn
            setIsOverflowing(isOver);
            //console.log("ggg", videoId)
        };

        checkOverflow();

        const observer = new ResizeObserver(checkOverflow);
        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [video.id, videoId]);

    const handlesetShowFull = () => {
        setShowFull(!showFull);
    }

    return (
        <div>
            <div className='description-ct'>
                <div
                    ref={textRef}
                    className={showFull ? 'description-full' : 'description'}
                >
                    {parseText(text)}
                </div>
            </div>
            {
                (!video.mucsicId && !isOverflowing && !showFull) ? (
                    <></>
                ) : (
                    <div className='bt-more-hide'>
                        <div className="name-song">{video.mucsicId ? video.musicName : ""}</div>
                        {
                            (isOverflowing) ? (
                                <div onClick={() => handlesetShowFull()} className="see-more-btn">
                                    Xem thêm
                                </div>
                            ) : (
                                <>
                                    {
                                        (showFull) ? (
                                            <div onClick={() => handlesetShowFull()} className="see-more-btn">
                                                Ẩn bớt
                                            </div>
                                        ) : (
                                            <>

                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                )
            }

        </div>
    );
};

export default Description;
