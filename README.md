# Program Kuis

Aplikasi Kuis Online ini merupakan mini project yang bertujuan untuk memberikan pengalaman interaktif dalam menjalani kuis online. Pengguna dapat mendaftar, login, meng-update profil, mengerjakan kuis, dan melihat hasil kuis serta peringkat pengguna lainnya. Proyek ini dibuat sebagai salah satu penilaian untuk Bab Backend.

## Tech

Beberapa tech stack yang diperlukan:

- Node.js - Platform utama untuk menjalankan server backend menggunakan JavaScript.
- MySQL - Sistem manajemen basis data relasional untuk menyimpan data aplikasi
- Express.js - Kerangka kerja web Node.js untuk menerapkan konsep MVC
- Postman - Dokumentasi API
- Railway - Deployment
- DBeaver - Mengelola basis data

## Features

- Authentication
  Pengguna dapat register dan login untuk memulai kuis.
- Profil Pengguna
  Pengguna dapat melihat, mengubah, dan menghapus data profil mereka sendiri.
- Classroom
  Pengguna dapat membuat classroom dan mengajak rekannya untuk bergabung dalam classroom.
- Jenis Kuis
  Terdapat kuis public dan private. Kuis public dapat dikerjakan oleh user siapapun, sedangkan kuis private terdapat dalam classroom, sehingga user harus join ke Classroom tersebut menggunakan join_code untuk dapat mengakses quiz.
- Role
  Terdapat 3 role, yaitu superadmin, admin, dan user. Setiap role memiliki akses yang berbeda sesuai dengan kebutuhan aplikasi.
- Ranking
  Setiap kuis memiliki akses ke endpoint ranking, sehingga pengguna dapat melihat peringkat mereka dan peringkat pengguna lainnya.

## How to Use

1. Clone repository ke dalam local

```sh
git clone https://github.com/Fullstack-Javascript-Sanber-Foundation/backend_project_TalithaDwiArini.git
```

2. Install package module

```sh
npm install
```

3. Import documentation
   Buka postman, kemudian import file Postman_documentation yang ada di file documentation ke Postman Anda.

4. Buat global variabel
   Buatlah global variabel untuk token, yang akan didapatkan ketika user sudah login. Untuk base_url gunakan:

```sh
https://backendprojecttalithadwiarini-production.up.railway.app
```

**Talitha Dwi Arini**
