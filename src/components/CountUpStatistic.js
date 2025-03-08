import React, { useState, useEffect } from 'react';
import { Statistic, Card } from 'antd';

const CountUpStatistic = ({ title, value, prefix, color }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startValue = 0;
    const step = value / 50;
    const duration = 2000;
    const interval = duration / 50;
    
    const timer = setInterval(() => {
      startValue += step;
      if (startValue >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card hoverable className="statistics-card">
      <Statistic
        title={
          <div style={{ 
            color: color, 
            fontSize: '16px', 
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {title}
          </div>
        }
        value={count}
        prefix={React.cloneElement(prefix, { 
          style: { 
            color: color,
            fontSize: '24px',
            marginRight: '8px'
          } 
        })}
        valueStyle={{ 
          color: color, 
          fontWeight: 'bold',
          fontSize: '28px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </Card>
  );
};

export default CountUpStatistic;