import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function Meme() {
  const [meme, setmeme] = useState({
    topText: '',
    bottomText: '',
    randomimage: 'https://i.ibb.co/1RJ6b5f/Untitled-design-unscreen.gif'
  });
  const [allmeme, setAll] = useState([]);
  const memeRef = useRef(null);

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((data) => setAll(data.data.memes));
  }, []);

  function getmeme() {
    const randomNumber = Math.floor(Math.random() * allmeme.length);
    const url = allmeme[randomNumber].url;
    setmeme((prevmeme) => ({
      ...prevmeme,
      randomimage: url,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setmeme((prevmeme) => ({
      ...prevmeme,
      [name]: value,
    }));
  }

  function downloadMeme() {

    const meme = memeRef.current.firstChild;
    const topText = memeRef.current.querySelector('.top').textContent;
    const bottomText = memeRef.current.querySelector('.bottom').textContent;
    const memeImage = memeRef.current.querySelector('.memeimage');
  
    const canvas = document.createElement('canvas');
    canvas.width = meme.offsetWidth;
    canvas.height = meme.offsetHeight;
  
    const context = canvas.getContext('2d');
    context.drawImage(memeImage, 0, 0, canvas.width, canvas.height);
    context.font = '40px Impact';
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.textAlign = 'center';
  
    context.fillText(topText, canvas.width / 2, 50);
    context.strokeText(topText, canvas.width / 2, 50);
    context.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    context.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
  
    const link = document.createElement('a');
    link.download = 'meme.jpeg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  }

  return (
    <main>
      <div className='form'>
        <input
          type='text'
          className='form--input'
          placeholder='Top Text'
          name='topText'
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type='text'
          className='form--input'
          placeholder='Bottom Text'
          name='bottomText'
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button onClick={getmeme} className='form--button'>
          Get a new meme image
        </button>
        <button onClick={downloadMeme} className='form--button'>
          Download
        </button>
      </div>
      <div className='meme' ref={memeRef}>
      <img src={meme.randomimage} className='memeimage' alt='meme' crossOrigin='anonymous' />
        <h2 className='meme--text top'>{meme.topText}</h2>
        <h2 className='meme--text bottom'>{meme.bottomText}</h2>
      </div>
    </main>
  );
}
