const API_URL = 'http://localhost:5000/api';

const verifyGrade10 = async () => {
    try {
        console.log('1. Logging in as Teacher One...');
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

        const { token, role } = await loginRes.json();
        console.log('Logged in as:', role);

        console.log('2. Fetching Classes...');
        const classesRes = await fetch(`${API_URL}/academic/classes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const classes = await classesRes.json();
        const grade10 = classes.find(c => c.name === 'Grade 10');
        
        if (!grade10) {
            console.log('❌ Grade 10 Class NOT found in academic/classes list!');
            
            // Debug: List all available classes
            console.log('Available classes:', classes.map(c => c.name));
            return;
        }
        console.log('Found Grade 10 ID:', grade10._id);

        console.log(`3. Fetching Students for Grade 10 (${grade10._id})...`);
        const studentsRes = await fetch(`${API_URL}/students?class=${grade10._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!studentsRes.ok) {
            console.error('Fetch Students Failed:', await studentsRes.text());
            return;
        }

        const students = await studentsRes.json();
        console.log(`Students API returned count: ${students.length}`);
        
        if (students.length === 0) {
            console.log("⚠️ NO STUDENTS FOUND! This is why the table is empty.");
        } else {
             students.forEach(s => console.log(` - ${s.name} (${s.class ? s.class.name : 'No Class'})`));
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifyGrade10();
