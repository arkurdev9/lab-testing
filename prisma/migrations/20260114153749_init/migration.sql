-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "kontak" TEXT,
    "jenis_instansi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestType" (
    "id" SERIAL NOT NULL,
    "nama_jenis_uji" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "TestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" SERIAL NOT NULL,
    "nama_parameter" TEXT NOT NULL,
    "satuan" TEXT,
    "harga" DOUBLE PRECISION NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "testTypeId" INTEGER NOT NULL,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "tanggal_registrasi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_pelaksanaan_lapangan" TIMESTAMP(3),
    "lokasi_pengujian" TEXT,
    "status_persetujuan" TEXT NOT NULL DEFAULT 'Pending',
    "total_biaya" DOUBLE PRECISION NOT NULL,
    "link_surat_tugas" TEXT,
    "keterangan" TEXT,
    "customerId" INTEGER NOT NULL,
    "adminId" INTEGER,
    "assignedFieldOfficerId" INTEGER,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParameterToTest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ParameterToTest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestType_nama_jenis_uji_key" ON "TestType"("nama_jenis_uji");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_ParameterToTest_B_index" ON "_ParameterToTest"("B");

-- AddForeignKey
ALTER TABLE "Parameter" ADD CONSTRAINT "Parameter_testTypeId_fkey" FOREIGN KEY ("testTypeId") REFERENCES "TestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_assignedFieldOfficerId_fkey" FOREIGN KEY ("assignedFieldOfficerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParameterToTest" ADD CONSTRAINT "_ParameterToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "Parameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParameterToTest" ADD CONSTRAINT "_ParameterToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
