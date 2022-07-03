import {useState, useEffect} from 'react';
import {socket} from '../socket';

function Test() {
  useEffect(() => {
    // socket.connect();
    socket.on('message', (message) => {
      console.log('daco');
    });
    socket.emit(
      'joinRoom',
      {
        name: 'Jozko',
        room: 'neviem este',
        id: 'moje id',
        last: null,
      },
      (cbMessage) => {
        console.log(cbMessage);
      }
    );
    // socket.disconnect();
  }, []);
  return <div></div>;
}

export default Test;
