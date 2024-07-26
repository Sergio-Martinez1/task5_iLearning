"use client"
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import randomIcon from './static/random-svgrepo-com.svg';
import Image from 'next/image';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(20);
  const [region, setRegion] = useState('en');
  const [seed, setSeed] = useState(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER));
  const [errors, setErrors] = useState(0)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(null)
  const [sliderValue, setSliderValue] = useState(0)
  const [fieldValue, setFieldValue] = useState(0)
  const loadingRef = useRef(null);
  const sliderRef = useRef(null);
  const fieldRef = useRef(null);

  useEffect(() => {
    const options = {
      root: document.querySelector('#scrollArea'),
      rootMargin: "0px",
      threshold: 1.0,
    };

    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fetch(`/api/users?offset=${offset}&limit=10&region=${region}&seed=${seed}&errors=${errors}`)
            .then(async (res) => {
              const data = await res.json();
              setUsers(prevUsers => [...prevUsers, ...data]);
              setOffset(prevOffset => prevOffset + 10);
            });
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const currentLoadingRef = loadingRef.current;

    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [offset]);

  useEffect(() => {
    fetch(`/api/users?offset=0&limit=20&region=${region}&seed=${seed}&errors=${errors}`)
      .then(async (res) => {
        const data = await res.json();
        setUsers(data);
        setOffset(20)
      });
  }, [region, seed, errors])

  function asignRegion(event: ChangeEvent) {
    let table = document.querySelector('#table')
    if (table) {
      table.scroll(0, 0)
    }
    setRegion(event.target.value)
  }

  function asignSeed(event: ChangeEvent) {
    let table = document.querySelector('#table')
    if (table) {
      table.scroll(0, 0)
    }
    setSeed(event.target.value);
  };

  function randomSeed() {
    let table = document.querySelector('#table')
    if (table) {
      table.scroll(0, 0)
    }
    setSeed(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER));
  }

  function slide(event: ChangeEvent) {
    if (timer) clearTimeout(timer)
    let table = document.querySelector('#table')
    if (table) {
      table.scroll(0, 0)
    }
    if (fieldRef.current) {
      let slideValue = Number(event.target.value)
      setSliderValue(slideValue)
      setFieldValue(slideValue)
      let id = setTimeout(() => {
        setErrors(slideValue)
      }, 500)
      setTimer(id)
    }
  }

  function changeError(event: ChangeEvent) {
    if (timer) clearTimeout(timer)
    let table = document.querySelector('#table')
    if (table) {
      table.scroll(0, 0)
    }
    let errorField = Number(event.target.value)
    if(errorField >= 1000) errorField = 1000
    if (fieldRef.current) {
      setSliderValue(errorField / 100)
      setFieldValue(errorField)
      let id = setTimeout(() => {
        setErrors(errorField)
      }, 400)
      setTimer(id)
    }
  }

  return (
    <main id='scrollArea' className='w-full h-screen flex flex-col items-center px-8 py-8 bg-slate-800 text-gray-300'>
      <div className='flex justify-between w-full mb-8 px-12'>
        <label className='flex gap-x-5 justify-center items-center'>
          Region:
          <select className='border-white border-[2px] p-1 bg-black' onChange={(event) => asignRegion(event)}>
            <option value="en">USA</option>
            <option value="ru">Russia</option>
            <option value="uk">Ukrania</option>
          </select>
        </label>
        <label className='flex gap-x-5 justify-center items-center'>
          Errors:
          <input type="range" min="0" max="10" step=".1" onChange={(event) => { slide(event) }} ref={sliderRef} value={sliderValue} />
          <input type="number" min="0" max="1000" className='border-white border-[2px] w-20 p-1 bg-black' onChange={(event) => { changeError(event) }} ref={fieldRef} value={fieldValue} />
        </label>
        <label className='flex gap-x-2 justify-center items-center'>
          Seed:
          <input type="number" className='border-white border-[2px] w-56 p-1 bg-black' value={seed} onChange={(event) => { asignSeed(event) }} />
          <button onClick={(event) => { randomSeed(event) }}><Image priority src={randomIcon} alt='Random' /></button>
        </label>
      </div>
      <section id='table' className="grid grid-flow-row w-full flex-grow overflow-y-auto text-sm">
        {users.map((user, index) => (
          <div key={index} className={`grid grid-cols-[70px_320px_280px_1fr_220px] min-h-12 max-h-fit gap-x-1 ${index % 2 === 0 ? 'bg-gray-700' : 'bg-black'}`}>
            <span className={`col-1 p-1 w-full flex justify-end items-center`} key={user.index}>{user.index}</span>
            <span className={`col-2 p-1 border-gray-600 border-l-2 w-fit flex items-center`} key={user.id}>{user.id}</span>
            <span className={`col-3 p-1 text-wrap break-words overflow-hidden border-gray-600 border-l-2 w-fit flex items-center`} key={user.fullname}>{user.fullname}</span>
            <span className={`col-4 p-1 text-wrap break-words overflow-hidden border-gray-600 border-l-2 flex items-center`} key={user.address}>{user.address}</span>
            <span className={`col-5 p-1 text-wrap break-words overflow-hidden border-gray-600 border-l-2 w-fit flex items-center`} key={user.phone}>{user.phone}</span>
          </div>
        ))}
        <div ref={loadingRef}>Loading...</div>
      </section>
    </main>
  );
}
