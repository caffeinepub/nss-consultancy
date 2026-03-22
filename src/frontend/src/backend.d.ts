import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Enquiry {
    id: bigint;
    name: string;
    email: string;
    company: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getEnquiry(email: string): Promise<Enquiry>;
    submitEnquiry(name: string, company: string, phone: string, email: string, message: string): Promise<void>;
}
