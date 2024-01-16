import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Otp = {
    id: string;
    otp: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    userId: string;
};
export type User = {
    id: string;
    name: string;
    phoneNumber: string;
    email: string | null;
    password: string | null;
    isVerified: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Otp: Otp;
    User: User;
};
