import {
  convertRoomApiDataToRoomData,
  ROOM_QUERY_KEY,
  RoomApiData,
  RoomCreateApiData,
  RoomData,
  RoomEditApiData,
} from "@client/utils/roomData";
import { zosiaApi, zosiaApiRoutes } from "@client/utils/zosiaApi";
import { Context } from "@reactivated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { showCustomToast } from "../../CustomToast";
import { ApiErrorMessage } from "./ApiErrorMessage";

export const useRoomMutations = (roomId: number, roomName?: string) => {
  const { user } = useContext(Context);

  const queryClient = useQueryClient();

  const invalidateRoomData = () => {
    queryClient.invalidateQueries({ queryKey: [ROOM_QUERY_KEY] });
  };

  const onMutationSuccess = (
    message: string,
    data?: AxiosResponse<RoomApiData, unknown>,
  ) => {
    if (data) {
      // Update rooms data with this specific room right after getting the response from server.
      const updatedRoom = convertRoomApiDataToRoomData(data.data);
      queryClient.setQueryData([ROOM_QUERY_KEY], (oldData: RoomData[]) => {
        return oldData.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room,
        );
      });
    }

    showCustomToast("success", message);

    // Invalidate the rooms data to refetch it from the server and get the most recent data for other rooms.
    invalidateRoomData();
  };

  const onMutationError = (error: Error) => {
    showCustomToast("error", <ApiErrorMessage error={error} />);
    console.error(error);

    // Invalidate the rooms data to refetch it from the server and get the most recent data for all rooms.
    invalidateRoomData();
  };

  const joinRoomMutation = useMutation({
    mutationFn: async (params: { userId: number; password?: string }) => {
      return await zosiaApi.post<RoomApiData>(
        zosiaApiRoutes.roomMember(roomId),
        {
          user: params.userId,
          password: params.password,
        },
      );
    },
    onSuccess: (data, { userId }) =>
      onMutationSuccess(
        userId === user.id
          ? `You've joined room ${data.data.name}.`
          : `You've added user to room ${data.data.name}.`,
        data,
      ),
    onError: onMutationError,
  });

  const leaveRoomMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await zosiaApi.delete<RoomApiData>(
        zosiaApiRoutes.roomMember(roomId),
        {
          data: { user: userId },
        },
      );
    },
    onSuccess: (data, userId) =>
      onMutationSuccess(
        userId === user.id
          ? `You've left room ${data.data.name}.`
          : `You've removed user from room ${data.data.name}.`,
        data,
      ),
    onError: onMutationError,
  });

  const lockRoomMutation = useMutation({
    mutationFn: async () => {
      return await zosiaApi.post<RoomApiData>(zosiaApiRoutes.lockRoom(roomId), {
        user: user.id,
      });
    },
    onSuccess: (data) =>
      onMutationSuccess(
        `You've locked room ${data.data.name}. Share the password with your friends.`,
        data,
      ),
    onError: onMutationError,
  });

  const unlockRoomMutation = useMutation({
    mutationFn: async () => {
      return await zosiaApi.delete<RoomApiData>(
        zosiaApiRoutes.lockRoom(roomId),
      );
    },
    onSuccess: (data) =>
      onMutationSuccess(
        `You've unlocked room ${data.data.name}. Now everybody can join it.`,
        data,
      ),
    onError: onMutationError,
  });

  const createRoomMutation = useMutation({
    mutationFn: async (roomData: RoomCreateApiData) => {
      return await zosiaApi.post<RoomApiData>(zosiaApiRoutes.rooms, roomData);
    },
    onSuccess: (data) =>
      onMutationSuccess(`You've created room ${data.data.name}.`, data),
    onError: onMutationError,
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async () => {
      return await zosiaApi.delete(zosiaApiRoutes.room(roomId));
    },
    onSuccess: () =>
      onMutationSuccess(
        `You've deleted room ${roomName}. You should inform its inhabitants about this.`,
      ),
    onError: onMutationError,
  });

  const editRoomMutation = useMutation({
    mutationFn: async (roomData: RoomEditApiData) => {
      return await zosiaApi.put<RoomApiData>(
        zosiaApiRoutes.room(roomId),
        roomData,
      );
    },
    onSuccess: (data) =>
      onMutationSuccess(`You've edited room ${data.data.name}.`, data),
    onError: onMutationError,
  });

  return {
    joinRoomMutation,
    leaveRoomMutation,
    lockRoomMutation,
    unlockRoomMutation,
    createRoomMutation,
    deleteRoomMutation,
    editRoomMutation,
  };
};
