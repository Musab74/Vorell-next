import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, NEXT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

const Chat = () => {
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const textInput = useRef<HTMLInputElement>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      switch (data.event) {
        case 'info': {
          const newInfo: InfoPayload = data;
          setOnlineUsers(newInfo.totalClients);
          break;
        }
        case 'getMessages': {
          const list: MessagePayload[] = data.list;
          setMessagesList(list);
          break;
        }
        case 'message': {
          const newMessage: MessagePayload = data;
          // Avoid mutating state directly
          setMessagesList((prev) => [...prev, newMessage]);
          break;
        }
        default:
          console.warn('Unknown event:', data.event);
      }
    };
  }, [socket]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOpenButton(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setOpenButton(false);
  }, [router.pathname]);

  /** HANDLERS **/
  const handleOpenChat = () => {
    setOpen((prevState) => !prevState);
    // focus input when opening
    setTimeout(() => {
      if (textInput.current && !open) textInput.current.focus();
    }, 300);
  };

  const getInputMessageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  }, []);

  const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickHandler();
    }
  };

  const onClickHandler = () => {
    if (!messageInput.trim()) {
      sweetErrorAlert(Messages.error4);
      return;
    }
    if (!socket) return;

    socket.send(
      JSON.stringify({
        event: 'message',
        data: messageInput.trim(),
      }),
    );
    setMessageInput('');
  };

  /** RENDER **/
  return (
    <Stack className="chatting">
      {openButton ? (
        <button
          className={`chat-button ${open ? 'open' : ''}`}
          onClick={handleOpenChat}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
        </button>
      ) : null}

      <Stack className={`chat-frame ${open ? 'open' : ''}`}>
        <Box className="chat-top" component="div">
          <div className="chat-title">Live Concierge</div>
          <RippleBadge className="online-badge" badgeContent={onlineUsers} />
        </Box>

        <Box className="chat-content" id="chat-content" ref={chatContentRef} component="div">
          <ScrollableFeed>
            <Stack className="chat-main">
              <Box
                flexDirection="row"
                sx={{ m: '10px 0px' }}
                component="div"
                className="welcome-wrap"
              >
                <div className="welcome">Welcome to Vorell Concierge ✨</div>
              </Box>

              {messagesList?.map((ele: MessagePayload, index) => {
                const { text, memberData } = ele;
                const memberImage = memberData?.memberImage
                  ? `${NEXT_APP_API_URL}/${memberData.memberImage}`
                  : '/img/profile/defaultUser.svg';

                const mine = memberData?._id === user?._id;

                return mine ? (
                  <Box
                    key={`${index}-mine`}
                    component="div"
                    className="msg-row mine"
                    sx={{ m: '10px 0px' }}
                  >
                    <div className="msg-right">{text}</div>
                  </Box>
                ) : (
                  <Box
                    key={`${index}-other`}
                    component="div"
                    className="msg-row other"
                    sx={{ m: '10px 0px' }}
                  >
                    <Avatar alt={memberData?.memberNick || 'User'} src={memberImage} className="avatar" />
                    <div className="msg-left">{text}</div>
                  </Box>
                );
              })}
            </Stack>
          </ScrollableFeed>
        </Box>

        <Box className="chat-bott" component="div">
          <input
            ref={textInput}
            autoFocus={true}
            disabled={!open}
            placeholder="Type a message"
            type="text"
            name="message"
            className="msg-input"
            value={messageInput}
            onChange={getInputMessageHandler}
            onKeyDown={getKeyHandler}
            aria-label="Message input"
          />
          <button
            className="send-msg-btn"
            onClick={onClickHandler}
            aria-label="Send message"
            disabled={!open}
          >
            <SendIcon className="send-icon" />
          </button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Chat;
