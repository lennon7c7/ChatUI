import React from 'react';
import {useNavigate} from 'react-router-dom';
import Chat, {MessageProps, ToolbarItemProps, useMessages,} from '../../../src';

type MessageWithoutId = Omit<MessageProps, '_id'>;

const initialMessages: MessageWithoutId[] = [
  {
    type: 'system',
    content: {text: 'SHOPPAAS专属智能客服 为您服务'},
  },
  {
    type: 'text',
    content: { text: 'Hi，我是您的专属智能助理，有问题请随时找我哦~' },
    user: {
      avatar: 'https://www.shoppaas.com/favicon.ico',
      name: 'SHOPPAAS',
    },
    createdAt: Date.now(),
    hasTime: true,
  },
];

// eslint-disable-next-line @typescript-eslint/no-redeclare
const toolbar: ToolbarItemProps[] = [
];

export default () => {
  // 消息列表
  const { messages, appendMsg } = useMessages(initialMessages);

  const msgRef = React.useRef(null);

  const navigate = useNavigate();

  window.appendMsg = appendMsg;
  window.msgRef = msgRef;

  // 发送回调
  function handleSend(type: string, val: string) {
    if (type === 'text' && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: 'text',
        content: {text: val},
        position: 'right',
      });

      // setTimeout(() => {
      //   setTyping(true);
      // }, 1000);

      fetch(window.location.origin + '/aichat/qa?question=' + val)
          .then(response => response.json())
          .then(result => {
            appendMsg({
              type: 'text',
              content: {text: result.msg},
            });
          })
          .catch(error => {
            console.log('error', error)
            appendMsg({
              type: 'text',
              content: {text: '出问题了，请重新提问'},
            });
          });
    }
  }

  function renderMessageContent(msg: MessageProps) {
    const { type, content } = msg;
    // 根据消息类型来渲染
    switch (type) {
      case 'text':
          return <div className="Bubble text" data-type="text">{content.text}</div>;
      default:
        return null;
    }
  }

  return (
    <Chat
      elderMode
      // onRefresh={handleRefresh}
      navbar={{
        leftContent: {
          icon: 'chevron-left',
          title: 'Back',
          onClick() {
            navigate('/');
          },
        },
        // rightContent: [
        //   {
        //     icon: 'apps',
        //     title: 'Applications',
        //   },
        //   {
        //     icon: 'ellipsis-h',
        //     title: 'More',
        //   },
        // ],
        title: '智能助理',
        // desc: '客服热线9510211(7:00-次日1:00)',
        // logo: 'https://gw.alicdn.com/imgextra/i4/O1CN016i66TT24lRwUecIk5_!!6000000007431-2-tps-164-164.png_80x80.jpg',
        // align: 'left',
      }}
      toolbar={toolbar}
      messagesRef={msgRef}
      recorder={{ canRecord: false }}
      wideBreakpoint="600px"
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};
