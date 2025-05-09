import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoCard from "../components/layout/VideoCard";
import { fetchVideos } from "../services/apiHome";
import { useAppState } from "../../../store/UserData";
import "../styles/Profile.css";
import { getProfile } from "../services/apiAccount";
import { getVideoOfUser } from "../services/apiVideo";
import { useParams } from "react-router-dom";
import CurrentPath from "../../../hooks/CurrentPath";

import ChangeInformation from "../components/ui/ChangeInformation";
import VideoCardOnProfile from "../components/ui/VideoCardOnProfile";

const Profile = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, resetIsNewVideo, isCommentOpen, isExpand } = useAppState();
    const [activeTab, setActiveTab] = useState(0);
    const [activeFilter, setActiveFilter] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Khai báo các state để lưu thông tin profile
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pov, setPov] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalVideoLikes, setTotalVideoLikes] = useState(0);
    const [profileImage, setProfileImage] = useState('');
    const [user, setUser] = useState({});
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const currentPath = CurrentPath();
    
    //const { uid } = useParams(); // Lấy uid từ URL

    const moveTab = (index) => {
        setActiveTab(index);
    };

    const moveFilter = (index) => {
        setActiveFilter(index);
        if (index === 0) {  // Mới nhất
            const sorted = [...videos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setVideos(sorted);
        }
        else if (index === 2) { // Cũ nhất
            const sorted = [...videos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setVideos(sorted);
        }
    };


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
        const path = window.location.pathname;
        console.log(path);
        const uid = path.startsWith('/') ? path.slice(1) : null;
        console.log(uid)
        const loadData = async () => {
            setIsLoading(true);
            setVideos([]);
            setUserId('');
            setUsername('');
            setEmail('');
            setDateOfBirth('');
            setTotalFollowers(0);
            setTotalFollowing(0);
            setTotalVideoLikes(0);
            setProfileImage('');
            setPov('');
            setUser({});
            
            const [resultUser, resultVideos] = await Promise.all([
                getProfile(uid),
                getVideoOfUser(uid)
            ]);

            if (resultUser.status) {
                const data = resultUser.data;
                setUser(data);
                setPov(data.pov);
                setUserId(data.userid);
                setUsername(data.username);
                setEmail(data.email);
                setDateOfBirth(data.dateOfBirth);
                setTotalFollowers(data.totalFollowers);
                setTotalFollowing(data.totalFollowing);
                setTotalVideoLikes(data.totalVideoLikes);
                setProfileImage(data.profileImage);
            }

            if (resultVideos.status) {
                setVideos(resultVideos.data.videos);
            }
            setIsLoading(false);
        };

        loadData();
    }, [currentPath]);


    if (!isLoading)
        return (
            <div className="profile-container">
                {/* Header */}
                <div className="header-prf">
                    <div className="avt-prf">
                        {profileImage ? (
                            <img src={profileImage} alt="User Avatar" className="avatar-prf" />
                        ) : (
                            <div className="avatar-prf"></div>
                        )}
                    </div>

                    <div className="ct-prf">
                        <div className="prf-name d-flex gap-3 mb-1">
                            <h4 className="u-name">{userId}</h4>
                            <h5 className="fullname">{username}</h5>
                        </div>

                        {
                            pov === 'owner' ? (
                                <div className="d-flex mb-2 button-profile">
                                    <div className="btn-prf-change"
                                        onClick={() => setIsOpen(true)}
                                    >Sửa hồ sơ</div>
                                    <div className="btn-prf">Quảng bá bài đăng</div>
                                    <div className="btn-prf"><i className="bi bi-gear-wide"></i></div>
                                    <div className="btn-prf"><i className="bi bi-reply" style={{ transform: "scaleX(-1)" }}></i></div>

                                </div>
                            ) : (
                                <>
                                    {
                                        pov === 'friend' ? (
                                            <div className="d-flex mb-2 button-profile">
                                                <div className="btn-prf"
                                                    onClick={console.log("click")}
                                                ><i class="bi bi-person-check" style={{ marginRight: "7px" }}></i><div> Đã follow</div></div>
                                                <div className="btn-prf">Tin nhắn</div>
                                                <div className="btn-prf"><i className="bi bi-reply" style={{ transform: "scaleX(-1)" }}></i></div>
                                                <div className="btn-prf"><i className="bi bi-three-dots"></i></div>

                                            </div>
                                        ) : // guest
                                            (
                                                <div className="d-flex mb-2 button-profile">
                                                    <div className="btn-prf-change"
                                                        onClick={console.log("click")}
                                                    >Follow</div>
                                                    <div className="btn-prf">Tin nhắn</div>
                                                    <div className="btn-prf"><i className="bi bi-reply" style={{ transform: "scaleX(-1)" }}></i></div>
                                                    <div className="btn-prf"><i className="bi bi-three-dots"></i></div>
                                                </div>
                                            )
                                    }
                                </>
                            )
                        }
                        {/* Stats */}
                        <div className="d-flex gap-4 mb-2 info-profile-total">
                            <div className=""><b>{totalFollowing}</b> Đã follow</div>
                            <div className=""><b>{totalFollowers}</b> Follower</div>
                            <div className=""><b>{totalVideoLikes}</b> Lượt thích</div>
                        </div>
                        { /* Bio */}
                        <div className="bio-prf mb-2">
                            <p className="bio">{user.bio && parseText(user.bio)}</p>
                        </div>
                    </div>
                </div>



                {/* Tabs */}
                <div className="h-prf-tab d-flex justify-content-between">
                    {/* Tabs chính */}
                    <div className="d-flex prf-tab">
                        {[
                            { id: 0, icon: "bi-list-ul", label: "Video" },
                            { id: 1, icon: "bi-bookmark-heart", label: "Yêu thích" },
                            { id: 2, icon: "bi-heart", label: "Đã thích" }
                        ].map(tab => (
                            <div
                                key={tab.id}
                                onClick={() => moveTab(tab.id)}
                                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                            >
                                <i className={`bi ${tab.icon}`}></i> {tab.label}
                            </div>
                        ))}
                    </div>

                    {/* Tabs bộ lọc */}
                    <div className="d-flex prf-filter-tab">
                        {["Mới nhất", "Thịnh Hành", "Cũ nhất"].map((label, index) => (
                            <div
                                key={index}
                                onClick={() => moveFilter(index)}
                                className={`filter-tab ${activeFilter === index ? "active" : ""}`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Section */}
                <div className="video-section">
                    {videos.map((video, index) => (
                        <VideoCardOnProfile key={index} video={video} />
                    ))}
                    {/* {videos ? (
                    <>
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    </>
                ) : (
                    <></>
                )} */}
                </div>

                {/* Upload Section */}
                {/* <div className="text-center mt-5">
                <div className="upload-icon">⬜</div>
                <p className="fw-bold">Tải video đầu tiên của bạn lên</p>
                <p>Video của bạn sẽ xuất hiện tại đây</p>
            </div> */}

                <ChangeInformation isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
            </div >
        );
};

export default Profile;
