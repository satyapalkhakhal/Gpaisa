import type { Company, Registrar } from '@/lib/ipoTypes';

export default function CompanyContactBlock({ company, registrar }: { company: Company | null | undefined; registrar: Registrar | null | undefined }) {
    if (!company && !registrar) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {company && (company.registered_office || company.phone || company.email || company.website) && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{company.name}</p>
                    {company.registered_office && <p className="text-gray-700">{company.registered_office}</p>}
                    {company.phone && <p className="text-gray-700">Phone: {company.phone}</p>}
                    {company.email && <p className="text-gray-700">Email: {company.email}</p>}
                    {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{company.website}</a>}
                </div>
            )}
            {registrar && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Registrar — {registrar.name}</p>
                    {registrar.phone && <p className="text-gray-700">Phone: {registrar.phone}</p>}
                    {registrar.email && <p className="text-gray-700">Email: {registrar.email}</p>}
                    {registrar.website && <a href={registrar.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{registrar.website}</a>}
                </div>
            )}
        </div>
    );
}
