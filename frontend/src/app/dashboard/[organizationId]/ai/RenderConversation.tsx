/* eslint-disable @next/next/no-img-element */
import React from "react";
import ButtonStatus from "@/app/components/ButtonStatus";
import Skeleton from "@/app/components/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, setHistory } from "@/lib/features/conversationSlice";
import { RootState } from "@/lib/store";
import {
  HistoryItem,
  IconComponentsProps,
  ICONS,
  RenderConversationProps,
} from "@/constants/types/type.dashboard";
import TableView from "./TableView";
import SqlRender from "@/app/components/SqlRender";

function IconComponents({ props }: IconComponentsProps) {
  const IconComponent = ICONS[props.slug];

  if (!IconComponent) {
    console.log(`Icon component not found for slug: ${props.slug}`);
  }

  return (
    <div className="flex items-center">
      <IconComponent className="mr-2" size={200} />
    </div>
  );
}

const RenderConversation = ({
  websocketRef,
  status,
  db,
}: RenderConversationProps) => {
  const dispatch = useDispatch();
  const conversationSlice = useSelector(
    (state: RootState) => state.conversation,
  );
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (conversationSlice.query === null || conversationSlice.query === "") {
      setTimeout(() => {}, 2000);
      return;
    }

    if (websocketRef.current) {
      const queryJson = JSON.stringify({ query: conversationSlice.query });

      websocketRef.current.send(queryJson);
      dispatch(setQuery({ query: "" }));
      dispatch(
        setHistory({
          message: conversationSlice.query,
          sql_query: "",
          messageFrom: "user",
          answer_type: null,
        }),
      );
    }
  };

  return (
    <React.Fragment>
      <div className="w-3/5 flex flex-col gap-4  justify-between h-full  p-6 bg-white rounded-2xl">
        <div className="overflow-y-scroll no-scrollbar h-full flex flex-col gap-2 text-justify bg-white">
          {conversationSlice.history.length > 0 && (
            <>
              {conversationSlice.history.map((item: HistoryItem, index) => (
                <div key={index}>
                  {item?.messageFrom === "chatbot" && (
                    <div className="flex flex-col gap-2">
                      <div className="">
                        <img
                          src="/images/dashboard/icon.svg"
                          alt=""
                          className="h-12"
                        />
                      </div>
                      {item?.answer_type === "table_response" && (
                        <TableView tableData={JSON.parse(item?.message)} />
                      )}

                      {item?.answer_type === "sql_query" && (
                        <SqlRender sqlQuery={item?.sql_query} />
                      )}
                    </div>
                  )}

                  {item?.messageFrom === "user" && (
                    <div className=" w-3/4 max-w-3/4  ml-auto flex flex-col items-end ">
                      <div>
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkoKsaYMuIoNLDH7O8ePOacLPG1mKXtEng&s"
                          alt=""
                          className="h-12 w-"
                        />
                      </div>
                      <p className="bg-lime-green text-white rounded-md p-2">
                        {item.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {status.status && <Skeleton />}
          <div className=" w-full flex justify-center flex-col gap-2 h-full items-center">
            {conversationSlice.history.length === 0 && (
              <IconComponents props={{ slug: db }} />
            )}
          </div>
        </div>
        <div className="mt-2 flex gap-2 ">
          <input
            type="text"
            name="query"
            id="query"
            className="block w-full rounded-md py-1.5 border-2 border-gray-200 outline-none focus:border-gray-200 text-gray-900 placeholder:text-gray-400  px-2"
            placeholder="Enter your query"
            value={conversationSlice.query}
            onChange={(e) => dispatch(setQuery({ query: e.target.value }))}
          />

          {!status.status ? (
            <button
              onClick={handleSubmit}
              className="bg-lime-green rounded-lg  p-3 px-5 font-semibold text-white"
            >
              Submit
            </button>
          ) : (
            <ButtonStatus message={status.message} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default RenderConversation;
