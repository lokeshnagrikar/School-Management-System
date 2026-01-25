const API_URL = 'http://localhost:5000/api';

const verifyGrade1 = async () => {
    try {
        console.log('1. Logging in as Teacher Two...');
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'teacher2@school.com',
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
        const grade1 = classes.find(c => c.name === 'Grade 1');
        
        if (!grade1) {
            console.log('❌ Grade 1 Class NOT found in academic/classes list!');
            return;
        }
        console.log('Found Grade 1 ID:', grade1._id);

        console.log(`3. Fetching Students for Grade 1 (${grade1._id})...`);
        const studentsRes = await fetch(`${API_URL}/students?class=${grade1._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!studentsRes.ok) {
            console.error('Fetch Students Failed:', await studentsRes.text());
            return;
        }

        const students = await studentsRes.json();
        console.log(`Students API returned count: ${students.length}`);
        students.forEach(s => console.log(` - ${s.name} (${s.class ? s.class.name : 'No Class'})`));

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifyGrade1();
