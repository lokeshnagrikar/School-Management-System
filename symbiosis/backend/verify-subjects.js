const API_URL = 'http://localhost:5000/api';

const verifySubjects = async () => {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@isbm.com',
                password: 'adminpassword'
            })
        });

        const { token } = await loginRes.json();

        console.log('2. Fetching All Classes...');
        const classesRes = await fetch(`${API_URL}/academic/classes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const classes = await classesRes.json();
        
        const grade10 = classes.find(c => c.name === 'Grade 10');
        if (!grade10) {
            console.log('❌ Grade 10 not found!');
            return;
        }

        console.log(`Found Grade 10 (${grade10._id})`);
        console.log('Subjects:', JSON.stringify(grade10.subjects, null, 2));

        if (!grade10.subjects || grade10.subjects.length === 0) {
            console.log("⚠️ NO SUBJECTS ASSIGNED TO GRADE 10!");
            console.log("Teacher cannot enter marks if no subjects exist.");
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifySubjects();
