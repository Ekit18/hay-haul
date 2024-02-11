import { Stops, stopsValues } from '@/components/TicketFiltering/enums';
import { FiltersState } from '@/components/TicketFiltering/types';
import { AllianceElement, FlightHelperElement, MergedFlight } from '@/libs/types/Flight/Flight.type';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type FlightHelperElementMap = { [code: string]: FlightHelperElement };

interface SearchState {
  filter: FiltersState | null;
  searchData: MergedFlight[];
  airlines: FlightHelperElementMap | null;
  airports: FlightHelperElementMap | null;
  stops: FlightHelperElementMap | null;
}

const initialState: SearchState = {
  filter: null,
  searchData: [],
  airlines: null,
  airports: null,
  stops: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FiltersState>) => {
      state.filter = action.payload;
    },
    setSearchData: (state, action: PayloadAction<MergedFlight[]>) => {
      state.searchData = action.payload;
    },
    setAirlines: (state, action: PayloadAction<FlightHelperElement[]>) => {
      state.airlines = action.payload.reduce((acc, item) => {
        acc[item.code] = item;
        return acc;
      }, {} as FlightHelperElementMap);
    },
    setAirports: (state, action: PayloadAction<FlightHelperElement[]>) => {
      state.airports = action.payload.reduce((acc, item) => {
        acc[item.code] = item;
        return acc;
      }, {} as FlightHelperElementMap);
    },
    setStops: (state, action: PayloadAction<AllianceElement[]>) => {
      state.stops = action.payload.reduce((acc, item) => {
        acc[item.code] = { ...item, name: stopsValues[item.code as Stops] };
        return acc;
      }, {} as FlightHelperElementMap);
    },
    resetSearchSlice: () => {
      return initialState;
    }
  }
});

export const { setFilter, setSearchData, setAirlines, setAirports, setStops, resetSearchSlice } = searchSlice.actions;
export default searchSlice.reducer;
