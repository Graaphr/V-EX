<!DOCTYPE html>
<html lang='id'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>V-EX</title>

    <script src='https://cdn.tailwindcss.com'></script>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <style>
        @theme {
            --color-main-blue: #2E05E0;
            --color-secondary-color: #f0f0f0;
            --color-secondary-gray: #F5F5F5;
            /* --font-poppins: var(--font-poppins); */
            /* --font-tilt-wrap: var(--font-tilt-wrap); */
        }

        .bg-main-blue {
            background-color: #2E05E0;
        }

        .text-main-blue {
            color: #2E05E0;
        }

        .font-poppins {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>

<body>

    <!-- Aksen gradient dekoratif -->
    <!-- <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-main-blue opacity-15 blur-3xl pointer-events-none"></div>

    <div class="absolute -bottom-36 -left-36 w-96 h-96 rounded-full bg-main-blue opacity-10 blur-3xl pointer-events-none"></div> -->

    <div class="min-h-screen flex items-center bg-gray-200 justify-center font-poppins px-6 relative overflow-hidden">

        <div class="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 px-10 py-12 text-center">

            <p class="text-7xl font-poppins font-extrabold text-main-blue tracking-tight">
                404
            </p>

            <div class="w-12 h-1 rounded-full bg-main-blue mx-auto my-5 opacity-60"></div>

            <p class="text-gray-600 font-medium mb-7 leading-relaxed">
                Halaman yang kamu cari tidak ditemukan.
            </p>

            <a
                href="/"
                class="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-main-blue text-white font-semibold text-sm hover:opacity-90 transition-colors">

                Kembali ke Beranda

            </a>

        </div>
    </div>

</body>

</html>