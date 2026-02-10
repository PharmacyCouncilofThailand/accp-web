import type { TicketType } from "@/lib/api";

/**
 * Parse allowedRoles to string array.
 * DB may store as:
 *   - JSON array:  '["thstd","thpro"]'
 *   - CSV string:  'thstd,thpro'
 *   - Single role: 'interpro'
 * Returns empty array if null/undefined.
 */
export function parseAllowedRoles(raw: string | null | undefined): string[] {
    if (!raw) return [];
    // Try JSON array first
    if (raw.startsWith("[")) {
        try {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return arr.map((r: string) => r.trim()).filter(Boolean);
        } catch {
            // fall through to CSV
        }
    }
    // Comma-separated or single value
    return raw.split(",").map((r) => r.trim()).filter(Boolean);
}

/**
 * Check if a ticket's allowedRoles contains any of the given roles.
 * Uses proper JSON parsing instead of substring match.
 */
export function ticketMatchesRoles(ticket: TicketType, roles: readonly string[]): boolean {
    const parsed = parseAllowedRoles(ticket.allowedRoles);
    return parsed.some((r) => roles.includes(r));
}

// Canonical role groups matching DB user_role enum
export const STUDENT_ROLES = ["thstd", "interstd"] as const;
export const PRO_ROLES = ["thpro", "interpro"] as const;

/**
 * Resolve tickets into dual-currency packages and add-ons.
 * Shared logic used by checkout, register, my-tickets, and payment pages.
 */
export interface ResolvedPackage {
    id: string;
    name: string;
    priceTHB: number;
    priceUSD: number;
    originalPriceTHB?: number;
    originalPriceUSD?: number;
    features: string[];
    badgeText?: string;
    description?: string;
}

export interface ResolvedAddOn {
    id: string;
    name: string;
    description: string;
    priceTHB: number;
    priceUSD: number;
}

function findBestTicket(tickets: TicketType[]): TicketType | null {
    if (tickets.length === 0) return null;
    const available = tickets.filter((t) => t.isAvailable);
    if (available.length > 0) return available.sort((a, b) => a.displayOrder - b.displayOrder)[0];
    return tickets.sort((a, b) => a.displayOrder - b.displayOrder)[0];
}

export function resolvePackages(tickets: TicketType[]): ResolvedPackage[] {
    const primary = tickets.filter((t) => t.category === "primary");

    const groups: { id: string; label: string; roles: readonly string[] }[] = [
        { id: "student", label: "Student", roles: STUDENT_ROLES },
        { id: "professional", label: "Professional", roles: PRO_ROLES },
    ];

    const result: ResolvedPackage[] = [];
    for (const group of groups) {
        const thb = findBestTicket(
            primary.filter((t) => t.currency === "THB" && ticketMatchesRoles(t, group.roles))
        );
        const usd = findBestTicket(
            primary.filter((t) => t.currency === "USD" && ticketMatchesRoles(t, group.roles))
        );

        if (thb || usd) {
            const ref = thb || usd;
            result.push({
                id: group.id,
                name: ref?.name || group.label,
                priceTHB: thb ? parseFloat(thb.price) : 0,
                priceUSD: usd ? parseFloat(usd.price) : 0,
                originalPriceTHB: thb?.originalPrice ? parseFloat(thb.originalPrice) : undefined,
                originalPriceUSD: usd?.originalPrice ? parseFloat(usd.originalPrice) : undefined,
                features: ref?.features || [],
                badgeText: ref?.badgeText || undefined,
                description: ref?.description || undefined,
            });
        }
    }
    return result;
}

export function resolveAddOns(tickets: TicketType[]): ResolvedAddOn[] {
    const addonTickets = tickets.filter((t) => t.category === "addon");
    const groups = new Map<string, { thb?: TicketType; usd?: TicketType }>();

    for (const t of addonTickets) {
        const key = t.groupName || t.name.toLowerCase();
        if (!groups.has(key)) groups.set(key, {});
        const g = groups.get(key)!;
        if (t.currency === "THB" && (!g.thb || t.displayOrder < g.thb.displayOrder)) g.thb = t;
        if (t.currency === "USD" && (!g.usd || t.displayOrder < g.usd.displayOrder)) g.usd = t;
    }

    const result: ResolvedAddOn[] = [];
    for (const [key, g] of groups) {
        const ref = g.thb || g.usd;
        result.push({
            id: key,
            name: ref?.name || key,
            description: ref?.description || "",
            priceTHB: g.thb ? parseFloat(g.thb.price) : 0,
            priceUSD: g.usd ? parseFloat(g.usd.price) : 0,
        });
    }
    return result;
}
