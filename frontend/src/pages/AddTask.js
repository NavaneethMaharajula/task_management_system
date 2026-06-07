import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddTask.css';

const initialState = {
	title: '',
	description: '',
	completed: false,
};

const AddTask = () => {
	const [task, setTask] = useState(initialState);
	const [loading, setLoading] = useState(false);

	const { title, description, completed } = task || {};
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			setLoading(true);
			axios
				.get(`http://localhost:5000/api/get/${id}`)
				.then((resp) => {
					const data = resp.data;
					if (Array.isArray(data) && data.length > 0 && data[0]) {
						setTask({
							title: data[0].title || '',
							description: data[0].description || '',
							completed: data[0].completed || false
						});
					} else {
						console.error('No task found with the provided ID');
						toast.error('Task not found');
						navigate('/');
					}
				})
				.catch((err) => {
					console.error('Error fetching task:', err);
					toast.error('Failed to load task details');
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setTask(initialState);
		}
	}, [id, navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title || !description) {
			return toast.warning('Please fill in all fields');
		} else {
			if (!id) {
				axios
					.post('http://localhost:5000/api/post', {
						title,
						description,
						completed,
					})
					.then(() => {
						setTask(initialState);
						toast.success('Task added successfully');
						setTimeout(() => {
							navigate('/');
						}, 500);
					})
					.catch((err) => {
						toast.error(err.response?.data?.error || 'Failed to add task');
					});
			} else {
				axios
					.put(`http://localhost:5000/api/update/${id}`, {
						title,
						description,
						completed,
					})
					.then(() => {
						setTask(initialState);
						toast.success('Task updated successfully');
						setTimeout(() => {
							navigate('/');
						}, 500);
					})
					.catch((err) => {
						toast.error(err.response?.data?.error || 'Failed to update task');
					});
			}
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setTask((prevTask) => ({ ...prevTask, [name]: value }));
	};

	if (loading) {
		return <div style={{ marginTop: '100px', textAlign: 'center' }}>Loading task details...</div>;
	}

	return (
		<div style={{ marginTop: '100px' }}>
			<form
				style={{
					margin: 'auto',
					padding: '15px',
					maxWidth: '500px',
					alignContent: 'center',
				}}
				onSubmit={handleSubmit}
			>
				<label htmlFor='title'>Task Title</label>
				<input
					type='text'
					id='title'
					name='title'
					placeholder='Title of your task...'
					value={title || ''}
					onChange={handleInputChange}
				/>
				<label htmlFor='description'>Description</label>
				<input
					type='text'
					id='description'
					name='description'
					placeholder='Description of your task...'
					value={description || ''}
					onChange={handleInputChange}
				/>

				<input type='submit' value={id ? 'Update' : 'Save'} />
				<Link to='/'>
					<input type='button' value='Go Back' />
				</Link>
			</form>
		</div>
	);
};

export default AddTask;
