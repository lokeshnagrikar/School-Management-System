const API_URL = 'http://localhost:5000/api';

const verifyMarksSaved = async () => {
    try {
        console.log('1. Logging in as Teacher...');
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'teacher1@school.com',
                password: 'password123'
            })
        });

        const { token } = await loginRes.json();

        // 2. Get Prerequisites
        console.log('2. Fetching Exam, Class, Subject...');
        const examsRes = await fetch(`${API_URL}/exams`, { headers: { Authorization: `Bearer ${token}` } });
        const exams = await examsRes.json();
        const finalExam = exams.find(e => e.name.includes('Test Exam') || e.name.includes('Final'));
        
        if (!finalExam) { console.error('No Exam found'); return; }

        const classesRes = await fetch(`${API_URL}/academic/classes`, { headers: { Authorization: `Bearer ${token}` } });
        const classes = await classesRes.json();
        const grade10 = classes.find(c => c.name === 'Grade 10');

        if (!grade10) { console.error('Grade 10 not found'); return; }
        
        // Use first subject
        // Note: verify-subjects.js showed subjects are populated in Grade 10
        // We'll trust the class object or fetch details? 
        // classes endpoint returns populated subjects.
        const math = grade10.subjects.find(s => s.name === 'Mathematics');
        if (!math) { console.error('Math subject not found'); return; }

        // 3. Get a Student
        const studentsRes = await fetch(`${API_URL}/students?class=${grade10._id}`, { headers: { Authorization: `Bearer ${token}` } });
        const students = await studentsRes.json();
        const aarav = students[0];

        console.log(`Target: Student ${aarav.name} (${aarav._id}), Exam: ${finalExam.name}, Subject: ${math.name}`);

        // 4. Submit Marks (Simulate Teacher Action)
        console.log('3. Submitting Marks (95/100)...');
        const payload = {
            examId: finalExam._id,
            classId: grade10._id,
            subjectId: math._id,
            marks: [
                {
                    studentId: aarav._id,
                    marksObtained: 95,
                    totalMarks: 100
                }
            ]
        };

        const saveRes = await fetch(`${API_URL}/exams/marks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (saveRes.ok) {
            console.log('✅ Marks Save Response: Success');
        } else {
            console.error('❌ Save Failed:', await saveRes.text());
            return;
        }

        // 5. Verify Persistence
        console.log('4. Verifying from Database...');
        // We can check student results
        const resultRes = await fetch(`${API_URL}/exams/results/student/${aarav._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const results = await resultRes.json();
        
        const examResult = results.find(r => r.exam._id === finalExam._id);
        if (examResult) {
            const mathResult = examResult.subjects.find(s => s.subject._id === math._id || s.subject.name === 'Mathematics');
            if (mathResult && mathResult.marksObtained === 95) {
                console.log('✅ VERIFIED: Database has correct marks: 95/100');
                console.log(`   Grade: ${examResult.grade}`);
                console.log(`   Percentage: ${examResult.percentage}%`);
            } else {
                console.error('❌ Mismatch:', mathResult);
            }
        } else {
            console.error('❌ No Result record found for this exam');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifyMarksSaved();
