import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	// loading the data from the mysql database
	const loadData = async () => {
		try {
			setLoading(true);
			const response = await axios.get('http://localhost:5000/api/get');
			if (Array.isArray(response.data)) {
				setData(response.data);
			} else if (response.data && Array.isArray(response.data.tasks)) {
				setData(response.data.tasks);
			} else {
				console.error('API returned non-array:', response.data);
				setData([]);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			toast.error('Failed to load tasks from server');
			setData([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	// Function to handle checkbox change
	const handleCheckboxChange = async (id, completed) => {
		try {
			await axios.put(`http://localhost:5000/api/updateCompleted/${id}`, {
				completed: completed ? 0 : 1, // Toggle completed status
			});
			toast.success('Task updated successfully');
			loadData(); // Reload data after updating
		} catch (error) {
			console.error('Error updating task:', error);
			toast.error('Failed to update task');
		}
	};

	// Function to delete a task
	const deleteTask = (id) => {
		if (window.confirm('Are you sure you want to delete this task?')) {
			axios.delete(`http://localhost:5000/api/remove/${id}`)
				.then(() => {
					toast.success('Task deleted successfully');
					loadData(); // Reload data after deleting
				})
				.catch((error) => {
					console.error('Error deleting task:', error);
					toast.error('Failed to delete task');
				});
		}
	};

	return (
		<div style={{ marginTop: '150px' }}>
			{/* Link to addTask page */}
			<Link to='/addTask'>
				<button className='btn btn-task'>Add Task</button>
			</Link>
			{/* Table to display tasks */}
			<table className='styled-table'>
				<thead>
					<tr>
						<th style={{ textAlign: 'center' }}>ID</th>
						<th style={{ textAlign: 'center' }}>Title</th>
						<th style={{ textAlign: 'center' }}>Description</th>
						<th style={{ textAlign: 'center' }}>Completed</th>
						<th style={{ textAlign: 'center' }}>Action</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan="5" style={{ textAlign: 'center' }}>Loading tasks...</td>
						</tr>
					) : (Array.isArray(data) ? data : []).length === 0 ? (
						<tr>
							<td colSpan="5" style={{ textAlign: 'center' }}>No tasks found</td>
						</tr>
					) : (
						(Array.isArray(data) ? data : []).map((item, index) => {
							return (
								<tr key={item.id}>
									<th scope='row'>{index + 1}</th>
									<td>{item.title}</td>
									<td>{item.description}</td>
									<td>
										{/* Checkbox to mark task as completed */}
										<input
											type='checkbox'
											checked={item.completed === 1}
											onChange={() =>
												handleCheckboxChange(item.id, item.completed)
											}
										/>
									</td>
									<td>
										{/* Link to updateTask page */}
										<Link to={`/updateTask/${item.id}`}>
											<button className='btn btn-edit'>Edit</button>
										</Link>
										{/* Button to delete a task */}
										<button
											className='btn btn-delete'
											onClick={() => deleteTask(item.id)}
										>
											Delete
										</button>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Home;
