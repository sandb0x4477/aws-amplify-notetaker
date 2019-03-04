import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import './App.css';

import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

class App extends Component {
  state = {
    id: '',
    note: '',
    notes: [],
  };

  componentDidMount() {
    this.listNotes();
  }

  listNotes = async () => {
    const allNotes = await API.graphql(graphqlOperation(listNotes));
    this.setState({
      notes: allNotes.data.listNotes.items,
    });
  };

  handleChange = event => {
    this.setState({
      note: event.target.value,
    });
  };

  handleUpdate = ({ id, note }) => {
    this.setState({
      id,
      note,
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { id, note, notes } = this.state;

    if (id) {
      const input = { id, note };
      const result = await await API.graphql(graphqlOperation(updateNote, { input }));
      this.setState({
        id: '',
        note: '',
        notes: notes.map(item => {
          if (item.id === id) {
            return {
              ...item,
              note: result.data.updateNote.note,
            };
          }
          return item;
        }),
      });
    } else {
      const input = { note };
      const result = await API.graphql(graphqlOperation(createNote, { input }));
      const newNote = result.data.createNote;
      this.setState({
        id: '',
        note: '',
        notes: [newNote, ...notes],
      });
    }
  };

  handleDelete = async ({ id }) => {
    const { notes } = this.state;
    const input = { id };
    const result = await API.graphql(graphqlOperation(deleteNote, { input }));

    this.setState({
      notes: notes.filter(note => note.id !== result.data.deleteNote.id),
    });
  };

  render() {
    const { id, notes, note } = this.state;

    return (
      <div className='flex flex-column items-center justify-center pa3 bg-washed-green'>
        <h1 className='code f2-1'>Amplify Notetaker</h1>
        <form className='mb3' onSubmit={this.handleSubmit}>
          <input
            type='text'
            className='pa2 f4'
            placeholder='Write your Note'
            value={note}
            onChange={this.handleChange}
          />
          <button className='pa2 f4' type='submit'>
            {id ? 'Update Note' : 'Add Note'}
          </button>
        </form>
        <div>
          {notes.map(note => (
            <div key={note.id} className='flex items-center'>
              <li
                className='list pa1 f3 note-text'
                onClick={() => this.handleUpdate(note)}>
                {note.note}
              </li>
              <button className='bg-transparent bn f4'>
                <span className='delete-cross' onClick={() => this.handleDelete(note)}>
                  &times;
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
