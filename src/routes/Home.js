import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import Swallow from 'components/Swallow';
import SwallowFactory from 'components/SwallowFactory';

const Home = ({ userObj }) => {
  const [swallows, setSwallows] = useState([]);
  useEffect(() => {
    dbService
      .collection('swallows')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const swallowArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSwallows(swallowArray);
      });
  }, []);
  return (
    <div className="container">
      <SwallowFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {swallows.map((swallow) => (
          <Swallow
            key={swallow.id}
            swallowObj={swallow}
            isOwner={swallow.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
