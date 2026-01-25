const API_URL = 'http://localhost:5000/api';

const testTeacherAccess = async () => {
    try {
        console.log('1. Attempting Login as Teacher...');
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'teacher1@school.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            console.error('Login Failed:', await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        const { token, role, name, _id } = loginData;
        
        console.log('Login Successful:', { name, role, id: _id });

        if (role !== 'TEACHER') {
            console.log('WARNING: Logged in user is NOT a TEACHER role:', role);
        }

        console.log('\n2. Fetching Students List...');
        const studentsRes = await fetch(`${API_URL}/students`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!studentsRes.ok) {
            console.error('Fetch Failed:', await studentsRes.text());
            return;
        }

        const students = await studentsRes.json();

        console.log(`Response Status: ${studentsRes.status}`);
        console.log(`Students Found: ${students.length}`);
        
        if (students.length > 0) {
            console.log('Sample Student:', students[0].name, 'Class:', students[0].class ? students[0].class.name : 'No Class');
        } else {
            console.log('❌ URL returned EMPTY list. This confirms the issue.');
        }

        console.log('\n3. Fetching Classes List...');
        const classesRes = await fetch(`${API_URL}/academic/classes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!classesRes.ok) {
            console.error('Classes Fetch Failed:', await classesRes.text());
        } else {
            const classes = await classesRes.json();
            console.log(`Classes Found: ${classes.length}`);
        }

    } catch (error) {
       console.error('Script Error:', error);
    }
};

testTeacherAccess();
