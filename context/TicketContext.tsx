"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api, { type TicketType } from "@/lib/api";
import {
    resolvePackages,
    resolveAddOns,
    type ResolvedPackage,
    type ResolvedAddOn,
} from "@/utils/tickets";

interface TicketContextValue {
    tickets: TicketType[];
    packages: ResolvedPackage[];
    addOns: ResolvedAddOn[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const TicketContext = createContext<TicketContextValue>({
    tickets: [],
    packages: [],
    addOns: [],
    loading: true,
    error: null,
    refetch: async () => {},
});

export function TicketProvider({ children }: { children: ReactNode }) {
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [packages, setPackages] = useState<ResolvedPackage[]>([]);
    const [addOns, setAddOns] = useState<ResolvedAddOn[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.tickets.list();
            setTickets(res.tickets);
            setPackages(resolvePackages(res.tickets));
            setAddOns(resolveAddOns(res.tickets));
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
            setError("Failed to load ticket data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <TicketContext.Provider
            value={{ tickets, packages, addOns, loading, error, refetch: fetchTickets }}
        >
            {children}
        </TicketContext.Provider>
    );
}

export function useTickets() {
    return useContext(TicketContext);
}
