"use client";

import { TicketType } from "@/lib/api";

// Roles mapping ตรงกับ userRoleEnum ใน DB
const ROLES = {
  STUDENT: ["thstd", "interstd"],
  PROFESSIONAL: ["thpro", "interpro"],
} as const;

interface UseTicketSelectorReturn {
  studentTicket: TicketType | null;
  professionalTicket: TicketType | null;
  addonTickets: TicketType[];
}

/**
 * Hook สำหรับเลือกตั๋วที่ดีที่สุดในแต่ละกลุ่ม
 * - เลือกตั๋วที่ isAvailable (จาก backend) และ displayOrder น้อยสุด
 * - ถ้าไม่มี available จะหา upcoming ticket แทน
 * - รองรับการสลับอัตโนมัติจาก Early Bird → Regular
 */
export function useTicketSelector(tickets: TicketType[]): UseTicketSelectorReturn {
  // 1. แบ่งกลุ่มตั๋วตาม allowedRoles
  const groups = {
    student: tickets.filter(
      (t) =>
        t.category === "primary" &&
        t.allowedRoles &&
        ROLES.STUDENT.some((role) => t.allowedRoles?.includes(role))
    ),
    professional: tickets.filter(
      (t) =>
        t.category === "primary" &&
        t.allowedRoles &&
        ROLES.PROFESSIONAL.some((role) => t.allowedRoles?.includes(role))
    ),
    addons: tickets.filter((t) => t.category === "addon"),
  };

  // 2. เลือกตั๋วที่ดีที่สุดในแต่ละกลุ่ม
  const selectBestTicket = (ticketGroup: TicketType[]): TicketType | null => {
    if (ticketGroup.length === 0) return null;

    // 2a. หาตั๋วที่ isAvailable (จาก backend — ไม่คำนวณเวลาเอง)
    const availableTickets = ticketGroup.filter((t) => t.isAvailable);

    if (availableTickets.length > 0) {
      // เลือกตั๋วที่ displayOrder น้อยสุด (Early Bird ก่อน Regular)
      return availableTickets.sort((a, b) => a.displayOrder - b.displayOrder)[0];
    }

    // 2b. ไม่มีตั๋วที่พร้อมขาย → หาตั๋วที่ใกล้จะเปิดขาย (upcoming)
    const upcomingTickets = ticketGroup
      .filter((t) => !t.isAvailable && t.saleStartDate)
      .sort(
        (a, b) =>
          new Date(a.saleStartDate!).getTime() -
          new Date(b.saleStartDate!).getTime()
      );

    return upcomingTickets[0] || null;
  };

  return {
    studentTicket: selectBestTicket(groups.student),
    professionalTicket: selectBestTicket(groups.professional),
    addonTickets: groups.addons,
  };
}
