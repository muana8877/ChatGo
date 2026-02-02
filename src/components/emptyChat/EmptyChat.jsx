import "./emptyChat.css";

const EmptyChat = () => {
  return (
    <div className="emptyChat">
      <div className="content">
        <div className="icon">
          <svg
            viewBox="0 0 303 172"
            width="360"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              fill="#364147"
              d="M229.565 160.229c32.647-12.996 53.768-44.769 53.768-83.052C283.333 34.543 242.79 0 191.667 0S100 34.543 100 77.177c0 20.18 7.882 38.658 20.839 52.837L98.475 172l43.267-24.071c15.832 8.043 34.037 12.354 53.258 12.354 11.875 0 23.303-1.737 33.904-5.005l.661 4.951z"
            />
            <path
              fill="#4A5E69"
              d="M61.772 135.748c-10.457-11.378-16.851-26.263-16.851-42.58C44.921 52.25 79.949 20 123.209 20c32.654 0 60.589 18.626 73.378 45.156-3.023-.345-6.095-.52-9.21-.52-47.047 0-85.197 34.853-85.197 77.858 0 7.583 1.232 14.9 3.496 21.769l-31.855 17.937 13.943-30.028-25.992-16.424z"
            />
          </svg>
        </div>
        <h1>ChatGo Web</h1>
        <p className="description">
          Send and receive messages without keeping your phone online.
          <br />
          Use ChatGo on up to 4 linked devices and 1 phone at the same time.
        </p>
        <div className="divider">
          <span></span>
        </div>
        <p className="hint">
          <span className="lock-icon">🔒</span>
          End-to-end encrypted
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;
