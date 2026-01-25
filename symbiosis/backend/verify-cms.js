const API_URL = 'http://localhost:5000/api';

const verifyCMS = async () => {
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

        console.log('2. Updating Home Hero content...');
        const text = "Welcome to the Future of Learning";
        const updateRes = await fetch(`${API_URL}/cms/content/home-hero`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({
                title: text,
                subtitle: "Automated CMS Test",
                body: "This text was updated by a script."
            })
        });

        if (!updateRes.ok) {
            console.error('Update Failed:', await updateRes.text());
            return;
        }
        console.log('Update Success.');

        console.log('3. Fetching Public Content...');
        const getRes = await fetch(`${API_URL}/cms/content`);
        const content = await getRes.json();
        
        const hero = content.find(c => c.section === 'home-hero');
        
        if (hero && hero.title === text) {
            console.log('✅ VERIFIED: Content updated and fetched successfully!');
            console.log(`   Title: ${hero.title}`);
        } else {
            console.error('❌ Mismatch:', hero);
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

verifyCMS();
