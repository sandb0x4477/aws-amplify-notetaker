import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import './App.css';

import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

const App = () => {
  const [item, setItem] = useState({
    id: '',
    note: '',
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const allNotes = await API.graphql(graphqlOperation(listNotes));
    setItems(allNotes.data.listNotes.items);
  };

  const handleChange = event => {
    setItem({
      note: event.target.value,
    });
  };

  const handleUpdate = ({ id, note }) => {
    setItem({
      id,
      note,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const { id, note } = item;

    if (note.id) {
      const input = { id, note };
      const result = await await API.graphql(graphqlOperation(updateNote, { input }));

      setItem({ id: '', note: '' });

      setItems(
        items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              note: result.data.updateNote.note,
            };
          }
          return item;
        })
      );
    } else {
      const input = { note };
      const result = await API.graphql(graphqlOperation(createNote, { input }));
      const newNote = result.data.createNote;

      setItem({id: '', note: ''});

      setItems([newNote, ...items]);
    }
  };

  const handleDelete = async id => {
    const input = { id };
    const result = await API.graphql(graphqlOperation(deleteNote, { input }));

    setItems(items.filter(note => note.id !== result.data.deleteNote.id));
  };

  return (
    <div className='flex flex-column items-center justify-center pa3 bg-washed-green'>
      <h1 className='code f2-1'>Amplify Notetaker</h1>
      <form className='mb3' onSubmit={handleSubmit}>
        <input
          type='text'
          className='pa2 f4'
          placeholder='Write your Note'
          value={item.note}
          onChange={handleChange}
        />
        <button className='pa2 f4' type='submit'>
          {item.id ? 'Update Note' : 'Add Note'}
        </button>
      </form>
      <div>
        {items.map(item => (
          <div key={item.id} className='flex items-center'>
            <li className='list pa1 f3 note-text' onClick={() => handleUpdate(item)}>
              {item.note}
            </li>
            <button className='bg-transparent bn f4'>
              <span className='delete-cross' onClick={() => handleDelete(item.id)}>
                &times;
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuthenticator(App, { includeGreetings: true });
