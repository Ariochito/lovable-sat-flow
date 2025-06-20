
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

interface ArchivedFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterReason: string;
  setFilterReason: (reason: string) => void;
}

export const ArchivedFilters: React.FC<ArchivedFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterReason,
  setFilterReason
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por Request ID o mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterReason} onValueChange={setFilterReason}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Motivo de archivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los motivos</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="user_request">Usuario</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="expired">Expiradas</SelectItem>
              <SelectItem value="auto_cleanup">Auto-limpieza</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
