import{ useState, useEffect } from 'react';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 每秒更新一次当前时间
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 每1000毫秒（1秒）更新一次

    // 清除定时器，避免内存泄漏
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className='time'>
      当前时间：
      {currentTime.getFullYear()}
      {'-' + (currentTime.getMonth() + 1)}{/* 月份从0开始，所以加1 */}
      {'-' + currentTime.getDate()}
      {' '}
      {currentTime.getHours()}
      {':'}
      {currentTime.getMinutes().toString().padStart(2, '0')}
      {':'}
      {currentTime.getSeconds().toString().padStart(2, '0')}
    </span>
  );
};

export default CurrentTime;