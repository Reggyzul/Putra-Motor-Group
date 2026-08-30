import { Branch, Vehicle } from '../types';
import { BRANCHES_DATA } from '../data/branches';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function getBranchById(branchId: string): Branch | undefined {
  return BRANCHES_DATA.find((b) => b.id === branchId);
}

export function buildWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

export function generateVehicleInquiryMessage(vehicle: Vehicle, branchName: string): string {
  return `Halo ${branchName} (Pandu Motor Group), saya tertarik dengan unit *${vehicle.name}* (Tahun ${vehicle.year}, Harga OTR ${formatRupiah(vehicle.price)}). Mohon info ketersediaan unit, simulasi DP/cicilan, dan jadwal cek unit. Terima kasih!`;
}

export function generateCreditApplicationMessage(
  vehicle: Vehicle,
  applicantName: string,
  dp: number,
  tenor: number,
  installment: number,
  branchName: string
): string {
  return `Halo ${branchName} (Pandu Motor Group), saya *${applicantName}* ingin mengajukan *Kredit Motor*:
- Unit: *${vehicle.name} (${vehicle.year})*
- Harga: ${formatRupiah(vehicle.price)}
- Rencana DP: ${formatRupiah(dp)}
- Tenor: ${tenor} Bulan
- Estimasi Cicilan: ${formatRupiah(installment)}/bulan

Mohon dibantu proses approval dan persyaratan berkasnya. Terima kasih!`;
}

export function generateDanaTunaiInquiryMessage(
  collateralType: 'motor' | 'mobil',
  brandModel: string,
  amount: number,
  tenor: number,
  monthlyInstallment: number,
  applicantName: string,
  applicantPhone: string,
  branchName: string
): string {
  return `Halo ${branchName} (Pandu Motor Group), saya *${applicantName}* (${applicantPhone}) ingin mengajukan *Layanan Dana Tunai (Gadai BPKB)*:
- Jaminan: BPKB ${collateralType.toUpperCase()}
- Kendaraan: *${brandModel}*
- Pengajuan Dana: *${formatRupiah(amount)}*
- Pilihan Tenor: ${tenor} Bulan
- Estimasi Angsuran: ${formatRupiah(monthlyInstallment)}/bulan

Mohon info kelengkapan syarat dan jadwal cek fisik BPKB/unit di showroom. Terima kasih!`;
}

export function generateTradeInMessage(
  currentVehicle: string,
  targetVehicle: Vehicle,
  applicantName: string,
  estimatedOldPrice: number,
  priceDifference: number,
  branchName: string
): string {
  return `Halo ${branchName} (Pandu Motor Group), saya *${applicantName}* ingin konsultasi *Tukar Tambah (Trade-In)*:
- Motor Lama Saya: *${currentVehicle}*
- Taksiran Valuasi: ${formatRupiah(estimatedOldPrice)}
- Ingin Ditukar Ke: *${targetVehicle.name}* (${formatRupiah(targetVehicle.price)})
- Estimasi Tambah: ${formatRupiah(priceDifference)}

Mohon info jadwal inspeksi fisik unit di showroom. Terima kasih!`;
}
