document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const filter = document.getElementById('filter');
    const listItems = [];
  
    getData();
  
    async function getData() {
      try {
        displayLoadingMessage();
    
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
    
        if (data.length > 0) {
          console.log('Data loaded from Node Express server:', data);
          displayUsers(data);
        } else {
          console.warn('Empty response from Node Express server');
          displayEmptyMessage();
        }
      } catch (error) {
        console.error('An error occurred while loading data from Node Express server:', error);
        displayErrorMessage();
      }
    }
    
    
    function displayLoadingMessage() {
      result.innerHTML = '<p>Loading...</p>';
    }
    function displayUsers(users) {
      result.innerHTML = '';
    
      const ul = document.createElement('ul');
    
      users.forEach(user => {
        const li = document.createElement('li');
        listItems.push(li);
    
        li.innerHTML = `
          <img src="${user.picture.large}" alt="${user.name.first}">
          <div class="user-info">
            <h4>${user.name.first} ${user.name.last}</h4>
            <p>${user.location.city}, ${user.location.country}</p>
            <button class="delete-btn">Delete</button>
          </div>
        `;
        ul.appendChild(li);
      });
    
      result.appendChild(ul);
    
      const filter = document.getElementById('filter');
      filter.addEventListener('input', (e) => filterData(e.target.value));
    
      // Add event listeners for delete buttons
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach((button, index) => {
        button.addEventListener('click', () => deleteUser(index + 1));
      });
    }
    
  
    async function saveNewUser(user) {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });
  
        if (response.ok) {
          console.log('New user data:', user);
          updateUserList();
        } else {
          throw new Error('Failed to save new user');
        }
      } catch (error) {
        console.error('An error occurred while saving new user:', error);
      }
    }
  
    async function deleteUser(userId) {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          console.log('User deleted with ID:', userId);
          updateUserList();
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('An error occurred while deleting user:', error);
      }
    }
  
    async function updateUserList() {
      try {
        displayLoadingMessage();
  
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
  
        displayUsers(users);
      } catch (error) {
        console.error('An error occurred while updating user list:', error);
      }
    }
    async function saveDataToServer(data) {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    
        if (response.ok) {
          console.log('Data saved to JSON server:', data);
        } else {
          throw new Error('Failed to save data to JSON server');
        }
      } catch (error) {
        console.error('An error occurred while saving data to JSON server:', error);
      }
    }  
  
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('firstNameInput').value;
      const lastName = document.getElementById('lastNameInput').value;
      const city = document.getElementById('cityInput').value;
      const country = document.getElementById('countryInput').value;
  
      const newUser = {
        name: {
          first: firstName,
          last: lastName
        },
        location: {
          city: city,
          country: country
        },
        picture: {
          large: 'path/to/profile-picture.jpg'
        }
      };
  
      await saveNewUser(newUser);
      addUserForm.reset();
    });
  });
  