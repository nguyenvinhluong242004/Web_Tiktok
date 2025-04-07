import { useState } from 'react';

const Description = ({ text }) => {
    const [showFull, setShowFull] = useState(false);

    // Tự động chèn thẻ <a> cho #hashtag và @mention
    const parseText = (input) => {
        return input.split(/(\s+)/).map((part, index) => {
            if (part.startsWith('#')) {
                const tag = part.substring(1);
                return <a key={index} href={`/hashtag/${tag}`} className='hashtag'>{part}</a>;
            }
            if (part.startsWith('@')) {
                const user = part.substring(1);
                return <a key={index} href={`/user/${user}`} className='link-user'>{part}</a>;
            }
            return part;
        });
    };

    return (
        <div className='description-ct'>
            <div className={showFull ? '' : 'description'}>
                {parseText(text)}
            </div>
            {
                text.length > 100 && (
                    <div onClick={() => setShowFull(!showFull)} className="see-more-btn">
                        {showFull ? 'Ẩn bớt' : 'Xem thêm'}
                    </div>
                )
            }
        </div>
    );
}


export default Description;